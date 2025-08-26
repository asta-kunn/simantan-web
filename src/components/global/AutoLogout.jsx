import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

const AutoLogout = ({ logoutTime = 60 * 1000 }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const setLogout = authStore((state) => state.setLogout);
  const { clearStacks, closeModal, closeSheet } = useUIStore();

  // If in development mode, do not set up the auto-logout timer
  const isDevelopment = import.meta.env.MODE === "master" ? false : true;
  // const isDevelopment = false;

  const startCountdownLog = () => {
    let secondsLeft = Math.floor(logoutTime / 1000);

    // Clear any existing countdown
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Start a new countdown that logs less frequently
    countdownRef.current = setInterval(() => {
      secondsLeft -= 1;

      if (secondsLeft <= 30 && secondsLeft > 0) {
        console.log(`Auto logout in ${secondsLeft} seconds...`);
      } else if (secondsLeft > 0 && secondsLeft % 60 === 0) {
        const minutesLeft = Math.floor(secondsLeft / 60);
        console.log(`Auto logout in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}...`);
      }

      if (secondsLeft <= 0) {
        clearInterval(countdownRef.current);
      }
    }, 1000);
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, logoutTime);

    // Restart the countdown log
    startCountdownLog();
  };

  const logout = () => {
    console.log("Logging out due to inactivity...");
    clearStacks();
    closeModal();
    closeSheet();
    setLogout();
    navigate("/login");
  };

  useEffect(() => {
    if (isDevelopment) return; // Skip timer in development mode

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isDevelopment]);

  return null;
};

export default AutoLogout;
