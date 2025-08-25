import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "@/components/Dexain";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

import authStore from "@/stores/authStore";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "@/hooks/use-toast";

import LoginBanner from "@/assets/images/Login Banner.webp";
import LoginIcon from "@/assets/images/Logo.png"

import { Loading } from "@/assets/animations/Loading";

/** Services */
import { login } from "@/services/auth.service";

function SingleSignOn() {
  /** Navigation */
  const location = useLocation();
  const navigate = useNavigate();

  /** Hooks */
  const loginMutation = useMutation(login);

  /** Store */
  const setSessionData = authStore((state) => state.setSessionData);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const setUserTypeData = authStore((state) => state.setUserTypeData);

  /** States */
  const [errorMessage, setErrorMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState("");

  // Store backUrl in a ref so it persists across renders
  const backUrlRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log({ params });
  }, [isAuthenticated, navigate, location.search]);

  const handleSubmit = async (values) => {
    let response = null;
    try {
      setErrorMessage("");
      response = await loginMutation.mutate({
        LOGIN_ID: values.LOGIN_ID,
        PASSWORD: values.PASSWORD,
        RESYNCHRONIZE: values.RESYNCHRONIZE ? "Y" : "N",
      });
      if (response?.success) {
        const {
          NAME,
          ACCESS_TOKEN,
          REFRESH_TOKEN,
          USER_TYPE,
          MENU,
          ACCESSIBLE_MENU,
          ACCESSIBLE_CARD,
        } = response.data;

        console.log({ ACCESSIBLE_CARD });

        setUserTypeData(USER_TYPE);
        setUsername(NAME);
        setShowWelcome(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSessionData(
          ACCESS_TOKEN,
          REFRESH_TOKEN,
          MENU,
          ACCESSIBLE_MENU,
          ACCESSIBLE_CARD
        );

        // After successful login, redirect to backUrl if present, else dashboard
        const backUrl = backUrlRef.current;
        if (backUrl) {
          if (/^https?:\/\//.test(backUrl)) {
            window.location.href = backUrl;
          } else {
            navigate(backUrl.startsWith("/") ? backUrl : `/${backUrl}`);
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrorMessage(response?.message);
      }
    } catch (error) {
      console.error("Error lengkap:", error);

      if (response && !response.success) {
        setErrorMessage(response.message || "Terjadi kesalahan pada server");
        console.log("Response dari backend:", response);
      } else if (error.response) {
        console.log("Error response:", error.response);
        if (error.response.data) {
          setErrorMessage(
            error.response.data.message || "Terjadi kesalahan pada server"
          );
          console.log("Error data:", error.response.data);
        } else {
          setErrorMessage(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        }
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Wrong username or password");
        toast({
          title: "Error",
          description: "Wrong username or password",
          variant: "destructive",
        });
      }
    }
  };

  if (showWelcome) {
    return (
      <motion.div
        className="fixed inset-0 bg-white flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.7 }}
      >
        <motion.div
          className="space-y-1 text-center text-gray-900"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.7 }}
        >
          <motion.h1
            className="text-3xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
          >
            Welcome
          </motion.h1>
          <motion.p
            className="text-xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.4 }}
          >
            {username}
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex bg-white relative overflow-hidden"
      >
        {/* Left side with minimal design */}
        <div className="w-0 lg:w-1/2 p-2 transition-all duration-300">
          <div
            className="w-full h-full rounded-l-xl bg-primary-normal bg-cover bg-center"
            style={{
              backgroundImage: `url(${LoginBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Right side with login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-[100px]"
          >
            <div className="mb-3">
              <img src={LoginIcon} alt="Login Logo" className="w-full" />
            </div>

            <Form
              defaultValues={{
                LOGIN_ID: "",
                PASSWORD: "",
              }}
              validation={z.object({
                LOGIN_ID: z.string().min(1, "Email is required"),
                PASSWORD: z.string().min(1, "Password is required"),
              })}
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {loginMutation.error ||
                  (errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg border border-primary-normal"
                    >
                      <p className="text-sm text-primary-normal font-medium">
                        {errorMessage || loginMutation.error}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>

              <div className="space-y-4">
                <Input
                  label="Email"
                  name="LOGIN_ID"
                  type="text"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Input
                  label="Password"
                  name="PASSWORD"
                  type="password"
                  placeholder="Your password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Checkbox label="Resynchronize" name="RESYNCHRONIZE" />
              </div>

              <Button
                type="submit"
                disabled={loginMutation.loading}
                className="w-full mt-3 py-3 px-4 bg-primary-normal text-white rounded-lg font-medium hover:bg-primary-normal/90 transition-colors disabled:opacity-50"
              >
                {loginMutation.loading ? (
                  <>
                    <Loading className="pb-2" />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SingleSignOn;
