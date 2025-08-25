import Cookies from "js-cookie";

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import useNotificationStore from "./notificationStore";

const env = import.meta.env.MODE;
const appName =
  import.meta.env.VITE_APP_NAME +
  (env === "master" ? "" : env.charAt(0).toUpperCase() + env.slice(1));

const authStore = create((set) => {
  const cookieOptions = {
    expires: 30, // 30 days
    sameSite: "strict",
    path: "/",
    httpOnly: env === "master" ? true : false,
    secure: env === "master" ? true : false,
  };

  const getDecodedToken = () => {
    const token = Cookies.get(`token${appName}`)
      ? Cookies.get(`token${appName}`)
      : localStorage.getItem(`token${appName}`);
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return {
    isAuthenticated: !!Cookies.get(`token${appName}`)
      ? Cookies.get(`token${appName}`)
      : localStorage.getItem(`token${appName}`),
    accessToken: Cookies.get(`token${appName}`)
      ? Cookies.get(`token${appName}`)
      : localStorage.getItem(`token${appName}`) || null,
    menus: localStorage.getItem(`menu${appName}`),
    accessibleMenu: localStorage.getItem(`accessibleMenu${appName}`)
      ? JSON.parse(localStorage.getItem(`accessibleMenu${appName}`))
      : null,
    accessibleCard: localStorage.getItem(`accessibleCard${appName}`)
      ? JSON.parse(localStorage.getItem(`accessibleCard${appName}`))
      : null,
    user: getDecodedToken(),
    userTypeData: localStorage.getItem(`userTypeData${appName}`),

    initializeSetup: () => {
      const menus = localStorage.getItem(`menu${appName}`);
      const accessibleMenu = localStorage.getItem(`accessibleMenu${appName}`);
      const accessibleCard = localStorage.getItem(`accessibleCard${appName}`)
        ? JSON.parse(localStorage.getItem(`accessibleCard${appName}`))
        : null;
      const user = getDecodedToken();
      set({
        menus,
        accessibleMenu,
        accessibleCard,
        user,
        isAuthenticated: !!user,
      });
    },

    getMenus: () => {
      const menus = localStorage.getItem(`menu${appName}`);
      return menus ? JSON.parse(menus) : [];
    },

    setUserTypeData: (userType) => {
      set({
        user_type: userType,
      });
      localStorage.setItem(
        `userTypeData${appName}`,
        JSON.stringify({
          user_type: userType,
        })
      );
    },

    setSessionData: (
      accessToken,
      refreshToken,
      menus,
      accessibleMenu,
      accessibleCard
    ) => {
      try {
        const user = jwtDecode(accessToken);

        /** Set Cookies */
        Cookies.set(`token${appName}`, accessToken, cookieOptions);
        Cookies.set(`refreshToken${appName}`, refreshToken, cookieOptions);

        /** Set Local Storage */
        localStorage.setItem(`menu${appName}`, JSON.stringify(menus));
        localStorage.setItem(
          `accessibleMenu${appName}`,
          JSON.stringify(accessibleMenu)
        );
        localStorage.setItem(
          `accessibleCard${appName}`,
          JSON.stringify(accessibleCard)
        );
        localStorage.setItem(`token${appName}`, accessToken);
        localStorage.setItem(`refreshToken${appName}`, refreshToken);

        /** Update Global State */
        set({
          isAuthenticated: true,
          user,
          accessToken,
          menus,
          accessibleMenu,
          accessibleCard,
        });
      } catch (error) {
        console.error("Error setting cookies:", error);
        throw new Error("Failed to set authentication data");
      }
    },

    setLogout: () => {
      try {
        // Remove all cookies
        const cookieStores = [`token${appName}`, `refreshToken${appName}`];
        const localStores = [
          `menu${appName}`,
          `accessibleMenu${appName}`,
          `accessibleCard${appName}`,
          `userTypeData${appName}`,
          `token${appName}`,
          `refreshToken${appName}`,
        ];

        cookieStores.forEach((cookie) => {
          Cookies.remove(cookie, { path: "/" });
        });

        localStores.forEach((store) => {
          localStorage.removeItem(store);
        });

        useNotificationStore.getState().reset();

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          menus: null,
          accessibleMenu: null,
          accessibleCard: null,
        });
      } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Failed to logout properly");
      }
    },
  };
});

export default authStore;
