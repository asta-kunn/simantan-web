import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import SocketProvider from "@/providers/SocketProvider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UIProvider } from "./components/global/UIProvider";

/** Stores */
import useAuthStore from "@/stores/authStore";

/** Router */
import { allRoutes } from "@/router/allRoutes";
import { settingRoutes } from "@/router/settingRoutes";
import AutoLogout from "./components/global/AutoLogout";

// Optimized loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-primary-normal"></div>
  </div>
);

// Lazy load components with prefetch
const LoginPage = lazy(() => import("./pages/Authorization/Login"));
const Layout = lazy(() => import("@/layout"));
const Forbidden = lazy(() => import("./pages/Forbidden"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Settings = lazy(() => import("@/pages/Settings/index"));

function App() {
  /** Const Declarations */
  const base = (import.meta.env?.VITE_PUBLIC_URL || "/").replace(/\/$/, "");


  /** Zustand State  */
  const accessibleMenu = useAuthStore((state) => state.accessibleMenu);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  /** State Declarations */
  const [isdebugMode, setIsdebugMode] = useState(false);

  /** Use Effect Declarations */
  useEffect(() => {
    const initialDebugMode = localStorage.getItem("debugMode") === "true";
    setIsdebugMode(initialDebugMode);

    const handleKeyDown = (e) => {
      if (e.shiftKey && e.altKey && (e.key === "d" || e.key === "D")) {
        const newDebugMode = !isdebugMode;
        setIsdebugMode(newDebugMode);
        localStorage.setItem("debugMode", newDebugMode ? "true" : "false");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isdebugMode]);

  const redirectByToken = () => {
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
            (authorizedUser.includes(user?.LOGIN_ID) || authorizedUser.includes(user?.username))
          ) {
            if (/^https?:\/\//.test(url)) {
              window.location.href = url;
              return null;
            } else {
              const navUrl = url?.startsWith("/") ? url : `/${url}`;
              return (
                <Navigate to={navUrl} state={parameter || undefined} replace />
              );
            }
          }
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
      const first = "/alsintan";
      return <Navigate to={first} replace />;
    }

    return <LoginPage />;
  };


  const RouterWrapper = ({ children }) => (
    <BrowserRouter
      basename={base || "/"}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </BrowserRouter>
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        retryDelay: 1000,
      },
    },
  });

  return (
    <RouterWrapper>
      <QueryClientProvider client={queryClient}>
          <AutoLogout logoutTime={15 * 60 * 1000} />
          <UIProvider>
          <Suspense fallback={null}>
            <Routes>
              {/* Public login route */}
              <Route
                path="login"
                element={isAuthenticated ? redirectByToken() : <LoginPage />}
              />
              {/* Protected routes */}
              <Route
                element={
                  isAuthenticated ? (
                    <Layout />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              >
                {/* Root redirects to Alsintan */}
                <Route key="root-redirect" path="/" element={<Navigate to="/alsintan" replace />} />
                <Route key="not-found" path="*" element={<NotFound />} />

                {/* Dynamic routes from configuration */}
                {allRoutes?.map(({ path, exact, component: Component }, index) => (
                  <Route key={index} path={path} exact={exact} element={<Component />} />
                ))}

                {/* Setting Routes */}
                {user?.ROLE_CODE === "SUPERUSER" &&
                  settingRoutes?.map(
                    ({ path, exact, component: Component }, index) => (
                      <Route
                        key={index}
                        path={path}
                        exact={exact}
                        element={<Component />}
                      />
                    )
                  )}
              </Route>
            </Routes>
          </Suspense>
          {/* Global Components */}
          <Toaster />
        </UIProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
}

export default App;
