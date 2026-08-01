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

import { useLogin, useSignup } from "@/hooks/auth/useAuth";

const LoginVideoBackground = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full rounded-l-xl overflow-hidden z-0"
      style={{ pointerEvents: "none", background: "#1a1a1a" }}
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
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
    </div>
  );
};

// Fungsi bantuan untuk decode JWT token dengan aman
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Gagal parse JWT", error);
    return null;
  }
};

function LoginPage() {
  const navigate = useNavigate();

  const { mutateAsync: loginMutation, isLoading: isLoginLoading, error: loginError } = useLogin();
  const { mutateAsync: signupMutation, isLoading: isSignupLoading, error: signupError } = useSignup();

  const user = authStore((state) => state.user);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const setSessionData = authStore((state) => state.setSessionData);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const effectRan = useRef(false);

  // 1. Tangani redirect jika user sudah punya sesi login yang aktif
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    if (isAuthenticated) {
      const userRole = user?.role || user?.ROLE_CODE;
      if (userRole === "ADMINISTRATOR") {
        navigate("/dashboard-admin");
      } else {
        navigate("/dashboard-petani");
      }
    }
    setIsInitialLoading(false);
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      if (isLoginMode) {
        const payload = {
          username: values.username,
          password: values.password,
        };

        const response = await loginMutation(payload);

        if (response?.access_token) {
          const ACCESS_TOKEN = response.access_token;
          const decodedToken = parseJwt(ACCESS_TOKEN);
          const userRole = decodedToken?.role || "PETANI"; 

          const appName = import.meta.env.VITE_APP_NAME || ""; 
          localStorage.setItem(`token${appName}`, ACCESS_TOKEN); 
          
          let minimalAccessibleMenu = [];
          let minimalMenus = []; 
        
          if (userRole === "ADMINISTRATOR") {
            minimalAccessibleMenu = ["/dashboard-admin"];
            minimalMenus = [
              { 
                NAME: "Dashboard Admin", 
                URL: "/dashboard-admin", 
                ICON: "fas fa-home"
              }
            ];
          } else {
            minimalAccessibleMenu = [
              "/dashboard-petani",
              "/alsintan",
              "/alsintan/input-apbn",
              "/alsintan/input-apbd",
              "/alsintan/detail",
              "/usulan-cpcl",
              "/pengaduan"
            ];

            minimalMenus = [
              { NAME: "Dashboard", URL: "/dashboard-petani", ICON: "fas fa-home" },
              { NAME: "Alsintan", URL: "/alsintan", ICON: "fas fa-tractor" },
              { NAME: "Usulan CPCL", URL: "/usulan-cpcl", ICON: "fas fa-file-alt" },
              { NAME: "Pengaduan", URL: "/pengaduan", ICON: "fas fa-comments" }
            ];
          }

          setSessionData(ACCESS_TOKEN, decodedToken, minimalMenus, minimalAccessibleMenu, null);
          
          if (userRole === "ADMINISTRATOR") {
            navigate("/dashboard-admin");
          } else {
            navigate("/dashboard-petani");
          }
        } else {
          setErrorMessage(response?.message || "Login gagal. Kredensial tidak valid.");
        }
      } else {
        const payload = {
          namaLengkap: values.namaLengkap,
          username: values.username,
          password: values.password,
        };

        const response = await signupMutation(payload);

        if (response) {
          toast({
            title: "Pendaftaran Berhasil!",
            description: "Akun Petani Anda telah dibuat. Silakan login.",
            variant: "success"
          });
          setIsLoginMode(true);
        } else {
          setErrorMessage("Gagal mendaftar. Silakan coba lagi.");
        }
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.message;
      setErrorMessage(
        serverMessage || (isLoginMode ? "Username atau password salah." : "Gagal mendaftar, username mungkin sudah dipakai.")
      );
    }
  };

  const validationSchema = isLoginMode
    ? z.object({
        username: z.string().min(1, "Username tidak boleh kosong"),
        password: z.string().min(1, "Password tidak boleh kosong"),
      })
    : z.object({
        namaLengkap: z.string().min(3, "Nama Lengkap minimal 3 karakter"),
        username: z.string().min(3, "Username minimal 3 karakter"),
        password: z.string().min(6, "Password minimal 6 karakter"),
      });

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading className="w-12 h-12" />
      </div>
    );
  }

  const isLoading = isLoginMode ? isLoginLoading : isSignupLoading;
  const displayError = errorMessage || (isLoginMode ? loginError?.message : signupError?.message);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex bg-white relative overflow-hidden justify-center"
      >
        {/* KIRI: Konten Video & Banner (Desktop Saja) */}
        <div className="hidden lg:flex lg:w-1/2 p-2 transition-all duration-300 relative flex-col">
          <LoginVideoBackground />
          <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
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

        {/* KANAN: Form Login/Signup */}
        <div className="w-full lg:w-1/2 flex items-center justify-center transition-all duration-300 p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-6 text-center flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {isLoginMode ? "Selamat Datang" : "Daftar Akun Baru"}
              </h1>
              
              {/* Teks ini hanya muncul di desktop (lg:block), disembunyikan di mobile (hidden) */}
              <p className="hidden lg:block text-gray-500 text-sm mt-1">
                {isLoginMode ? "Silakan login ke akun Anda" : "Daftar sebagai Petani untuk mengajukan usulan"}
              </p>

              {/* Banner ini hanya muncul di mobile (lg:hidden), diletakkan tepat di bawah judul */}
              <div className="flex lg:hidden justify-center mt-4 w-full">
                <img
                  src={LoginBanner}
                  alt="Login Banner Mobile"
                  className="w-60 sm:w-70 h-auto object-contain rounded-lg shadow-sm border border-gray-100"
                  style={{ background: "rgba(255,255,255,0.9)", padding: "0.5rem" }}
                />
              </div>
            </div>

            <Form
              key={isLoginMode ? "login" : "signup"} 
              defaultValues={{ namaLengkap: "", username: "", password: "" }}
              validation={validationSchema}
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50"
                  >
                    <p className="text-sm text-red-600 font-medium">
                      {typeof displayError === 'string' ? displayError : "Terjadi kesalahan pada server."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {!isLoginMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <Input
                      label="Nama Lengkap"
                      name="namaLengkap"
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-normal"
                    />
                  </motion.div>
                )}

                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-normal"
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-normal"
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

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setErrorMessage(""); 
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