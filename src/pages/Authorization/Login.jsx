import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "@/components/Dexain";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

import authStore from "@/stores/authStore";
import { toast } from "@/hooks/use-toast";

import LoginBanner from "@/assets/images/logo.jpeg";
import LoginVideo from "@/assets/images/video.mp4";

import { Loading } from "@/assets/animations/Loading";

/** Services */
// Pastikan useSignup sudah diexport dari file ini
import { useLogin, useSignup } from "@/hooks/auth/useAuth";

const LoginVideoBackground = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full rounded-l-xl overflow-hidden z-0"
      style={{
        pointerEvents: "none",
        background: "#1a1a1a",
      }}
    >
      <video
        src={LoginVideo}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100%",
          minWidth: "100%",
          objectFit: "cover",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
};

function LoginPage() {
  /** Navigation */
  const navigate = useNavigate();

  /** Hooks */
  const { mutateAsync: loginMutation, isLoading: isLoginLoading, error: loginError } = useLogin();
  // Tambahkan hook signup
  const { mutateAsync: signupMutation, isLoading: isSignupLoading, error: signupError } = useSignup();

  /** Store */
  const user = authStore((state) => state.user);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const setSessionData = authStore((state) => state.setSessionData);

  /** States */
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // State untuk toggle form

  // Use a ref to track if the effect has already run
  const effectRan = useRef(false);

  // --- REDIRECT LOGIC ON PAGE LOAD ---
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (isAuthenticated) {
      if (token) {
        try {
          const decoded = atob(token);
          const { authorizedUser, url, parameter } = JSON.parse(decoded);

          if (
            Array.isArray(authorizedUser) &&
            authorizedUser.length > 0 &&
            authorizedUser.includes(user.LOGIN_ID)
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
          console.log("[LoginPage] Error decoding token:", e);
        }
      }
      navigate("/alsintan");
    }

    setIsInitialLoading(false);
  }, [isAuthenticated, navigate, user]);

  // --- SUBMIT LOGIC (LOGIN & SIGNUP) ---
  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      const payload = {
        username: values.username,
        password: values.password,
      };

      if (isLoginMode) {
        // PROSES LOGIN
        const response = await loginMutation(payload);

        if (response?.access_token) {
          const ACCESS_TOKEN = response.access_token;
          const REFRESH_TOKEN = null;
          const ACCESSIBLE_CARD = null;

          const minimalMenus = [
            {
              ID: "ALSINTAN",
              NAME: "Laporan Pemanfaatan & Kondisi Alsintan",
              URL: "/alsintan",
              ICON: "bx bx-spreadsheet",
              SUB_MENU: [],
            },
          ];

          const minimalAccessibleMenu = [
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

          const params = new URLSearchParams(window.location.search);
          const token = params.get("token");

          if (token) {
            try {
              const decoded = atob(token);
              const { authorizedUser, url, parameter } = JSON.parse(decoded);
              if (Array.isArray(authorizedUser) && authorizedUser.includes(values.username)) {
                if (/^https?:\/\//.test(url)) {
                  window.location.href = url;
                } else {
                  const navUrl = url?.startsWith("/") ? url : `/${url}`;
                  navigate(navUrl, parameter ? { state: parameter } : undefined);
                }
                return;
              }
            } catch (e) {}
          }
          navigate("/alsintan");
        } else {
          setErrorMessage(response?.message || "Login failed");
        }
      } else {
      // PROSES SIGNUP
      const response = await signupMutation(payload);

      // Jika API NestJS kamu mengembalikan object atau status sukses tertentu, 
      // kamu bisa sesuaikan kondisi if di bawah ini (misal: response atau response?.success)
      if (response) {
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Silakan login menggunakan akun yang baru dibuat.",
          variant: "success"
        });
        
        // Pastikan ini dieksekusi agar form berubah kembali ke mode Login
        setIsLoginMode(true); 
      } else {
        setErrorMessage("Gagal mendaftar. Silakan coba lagi.");
      }
    }
    } catch (error) {
      setErrorMessage(
        isLoginMode 
          ? "Username or password is invalid" 
          : "Gagal mendaftar, username mungkin sudah dipakai"
      );
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading className="w-12 h-12" />
      </div>
    );
  }

  // Gabungkan error message
  const currentError = errorMessage || (isLoginMode ? loginError : signupError);
  const isLoading = isLoginMode ? isLoginLoading : isSignupLoading;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex bg-white relative overflow-hidden justify-center"
      >
        <div className="w-0 lg:w-1/2 p-2 transition-all duration-300 relative flex flex-col">
          <LoginVideoBackground />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <img
              src={LoginBanner}
              alt="Login Banner"
              className="w-full h-full rounded-xl"
              style={{
                objectFit: "contain",
                background: "rgba(255,255,255,0.7)",
                padding: "2.5rem",
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center transition-all duration-300 min-w-[500px] max-w-[50%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Header Form Dinamis */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {isLoginMode ? "Selamat Datang" : "Daftar Akun Baru"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isLoginMode ? "Silakan login ke akun Anda" : "Lengkapi data untuk mendaftar"}
              </p>
            </div>

            <Form
              defaultValues={{ username: "", password: "" }}
              validation={z.object({
                username: z.string().min(1, "Username tidak boleh kosong"),
                password: z.string().min(1, "Password tidak boleh kosong"),
              })}
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {currentError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50"
                  >
                    <p className="text-sm text-red-600 font-medium">
                      {currentError.toString()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-normal"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-normal"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 px-4 bg-primary-normal text-white rounded-lg font-medium hover:bg-primary-normal/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loading className="pb-2" />
                ) : isLoginMode ? (
                  "Login"
                ) : (
                  "Daftar"
                )}
              </Button>
            </Form>

            {/* Toggle Button untuk pindah mode Sign Up <-> Login */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setErrorMessage(""); // Reset error saat ganti mode
                }}
                className="text-primary-normal font-semibold hover:underline focus:outline-none"
              >
                {isLoginMode ? "Daftar di sini" : "Login di sini"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LoginPage;