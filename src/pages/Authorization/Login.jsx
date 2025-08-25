import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "@/components/Dexain";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

import authStore from "@/stores/authStore";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "@/hooks/use-toast";

import LoginBanner from "@/assets/images/Logo.png";

import { Loading } from "@/assets/animations/Loading";

/** Services */
import { useLogin } from "@/hooks/auth/useAuth";

function LoginPage() {
  /** Navigation */
  const navigate = useNavigate();

  /** Hooks */
  const { mutateAsync: loginMutation, isLoading: isLoginLoading, error: loginError } = useLogin();

  /** Store */
  const user = authStore((state) => state.user);
  const accessibleMenu = authStore((state) => state.accessibleMenu);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const setSessionData = authStore((state) => state.setSessionData);
  const setUserTypeData = authStore((state) => state.setUserTypeData);

  /** States */
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState("");

  // For token-based redirect after login
  const [authorizedUser, setAuthorizedUser] = useState([]);
  const [url, setUrl] = useState("");
  const [parameter, setParameter] = useState("");

  // Use a ref to track if the effect has already run
  const effectRan = useRef(false);

  // --- REDIRECT LOGIC ON PAGE LOAD ---
  useEffect(() => {
    // Add logging for each process
    if (effectRan.current) {
      console.log("[LoginPage] Effect already ran, skipping.");
      return;
    }
    effectRan.current = true;
    console.log("[LoginPage] Effect running for the first time.");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(
      "[LoginPage] isAuthenticated:",
      isAuthenticated,
      "| token:",
      token
    );

    if (isAuthenticated) {
      if (token) {
        try {
          const decoded = atob(token);
          console.log("[LoginPage] Decoded token:", decoded);
          const { authorizedUser, url, parameter } = JSON.parse(decoded);
          console.log("[LoginPage] Token contents:", {
            authorizedUser,
            url,
            parameter,
          });

          // If user is in authorizedUser, redirect to url (with parameter if present)
          if (
            Array.isArray(authorizedUser) &&
            authorizedUser.length > 0 &&
            authorizedUser.includes(user.LOGIN_ID)
          ) {
            console.log(
              `[LoginPage] User ${user.LOGIN_ID} is authorized for redirect.`
            );
            if (/^https?:\/\//.test(url)) {
              console.log(`[LoginPage] Redirecting to external URL: ${url}`);
              window.location.href = url;
            } else {
              const navUrl = url?.startsWith("/") ? url : `/${url}`;
              console.log(
                `[LoginPage] Redirecting to internal URL: ${navUrl} with parameter:`,
                parameter
              );
              navigate(navUrl, parameter ? { state: parameter } : undefined);
            }
            return;
          } else {
            console.log(
              `[LoginPage] User ${user.LOGIN_ID} is NOT in authorizedUser list.`
            );
          }
        } catch (e) {
          console.log("[LoginPage] Error decoding or parsing token:", e);
          // If token is invalid, just continue to fallback
        }
      }
      // If no valid token or not authorized, redirect to first accessible menu or dashboard

      const firstMenu = accessibleMenu[0] || "/dashboard";
      console.log(
        `[LoginPage] Redirecting to first accessible menu or dashboard: ${firstMenu}`
      );
      navigate(firstMenu);
    } else {
      console.log("[LoginPage] Not authenticated, showing login form.");
    }

    // Set loading to false after authentication logic completes
    setIsInitialLoading(false);
  }, [isAuthenticated, window.location.search, navigate, user]);

  // --- LOGIN SUBMIT LOGIC ---
  const handleSubmit = async (values) => {
    setErrorMessage("");
    let response = null;
    try {
      const payload = {
        username: values.username,
        password: values.password,
      };
      response = await loginMutation(payload);

      if (response?.access_token) {
        const ACCESS_TOKEN = response.access_token;
        const REFRESH_TOKEN = null;
        const ACCESSIBLE_CARD = null;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // Build minimal menus for this small project (Dashboard + Alsintan)
        const minimalMenus = [
          {
            ID: "DASHBOARD",
            NAME: "Dashboard",
            URL: "/dashboard",
            ICON: "bx bx-home-alt",
            SUB_MENU: [],
          },
          {
            ID: "ALSINTAN",
            NAME: "Laporan Pemanfaatan & Kondisi Alsintan",
            URL: "/alsintan",
            ICON: "bx bx-spreadsheet",
            SUB_MENU: [],
          },
        ];

        const minimalAccessibleMenu = [
          "/dashboard",
          "/alsintan",
          "/alsintan/input-apbn",
          "/alsintan/input-apbd",
        ];

        setSessionData(
          ACCESS_TOKEN,
          REFRESH_TOKEN,
          minimalMenus,
          minimalAccessibleMenu,
          ACCESSIBLE_CARD
        );

        if (token) {
          try {
            const decoded = atob(token);
            const { authorizedUser, url, parameter } = JSON.parse(decoded);

            if (
              Array.isArray(authorizedUser) &&
              authorizedUser.length > 0 &&
              authorizedUser.includes(values.username)
            ) {
              if (/^https?:\/\//.test(url)) {
                window.location.href = url;
              } else {
                const navUrl = url?.startsWith("/") ? url : `/${url}`;
                navigate(navUrl, parameter ? { state: parameter } : undefined);
              }
              return;
            }
          } catch (e) {
            // If token is invalid, just continue to fallback
          }
        }
        // If no valid token or not authorized, redirect to dashboard
        navigate("/dashboard");
      } else {
        setErrorMessage(response?.message);
      }
    } catch (error) {
      setErrorMessage("Username or password is invalid");
    }
  };

  // if (showWelcome) {
  //   return (
  //     <motion.div
  //       className="fixed inset-0 bg-white flex flex-col items-center justify-center"
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       exit={{ opacity: 0, scale: 0.95 }}
  //       transition={{ 
  //         ease: [0.19, 1.0, 0.22, 1.0], 
  //         duration: 0.3 
  //       }}
  //     >
  //       <motion.div
  //         className="space-y-1 text-center text-gray-900"
  //         initial={{ scale: 0.5, opacity: 0 }}
  //         animate={{ scale: 1, opacity: 1 }}
  //         exit={{ scale: 0.8, opacity: 0 }}
  //         transition={{ ease: "easeInOut", duration: 0.2 }}
  //       >
  //         <motion.h1
  //           className="text-3xl font-bold"
  //           initial={{ y: -20, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           exit={{ y: -10, opacity: 0 }}
  //           transition={{ ease: "easeInOut", duration: 0.2, delay: 0.1 }}
  //         >
  //           Welcome
  //         </motion.h1>
  //         <motion.p
  //           className="text-xl"
  //           initial={{ y: -20, opacity: 0 }}
  //           animate={{ y: 0, opacity: 1 }}
  //           exit={{ y: 10, opacity: 0 }}
  //           transition={{ ease: "easeInOut", duration: 0.2, delay: 0.2 }}
  //         >
  //           {username}
  //         </motion.p>
  //       </motion.div>
  //     </motion.div>
  //   );
  // }

  // Show loading spinner while initializing
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading className="w-12 h-12" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex bg-white relative overflow-hidden justify-center"
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
        <div className="w-full lg:w-1/2 flex items-center justify-center transition-all duration-300 min-w-[500px] max-w-[50%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
         

            <Form
              defaultValues={{
                username: "",
                password: "",
              }}
              validation={z.object({
                username: z.string().min(1, "username cannot be empty"),
                password: z.string().min(1, "password cannot be empty"),
              })}
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {loginError ||
                  (errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg border border-primary-normal"
                    >
                      <p className="text-sm text-primary-normal font-medium">
                        {errorMessage || loginError}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>

              <div className="space-y-2">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Your username"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-400"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoginLoading}
                className="w-full mt-3 py-3 px-4 bg-primary-normal text-white rounded-lg font-medium hover:bg-primary-normal/90 transition-colors disabled:opacity-50"
              >
                {isLoginLoading ? (
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

export default LoginPage;
