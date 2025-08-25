import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { createSocketConfigs, getEnvironmentConfig } from "@/config/socket.config.jsx";
import {
  createSocket,
  setupSocketEvents,
  cleanupSockets,
  getEnabledConfigs,
  validateSocketConfig,
  getSocketStatus
} from "@/utils/socket.utils";

/**
 * Enhanced Socket Provider (Optimized Version)
 * 
 * This version reduces socket reconnections to an absolute minimum by:
 * - Only reconnecting when authentication changes
 * - Maintaining persistent connections across navigation
 * - Smart user identity change detection
 */

export default function SocketProviderEnhanced({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const socketsRef = useRef([]);
  const navigateRef = useRef(navigate);
  const lastAuthStateRef = useRef({ isAuthenticated: false, userId: null });
  const lastUserRef = useRef(null);

  // Keep navigate ref updated
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Main socket management effect
  useEffect(() => {
    const currentUserId = user?.USER_ID || user?.ID || user?.id;
    const lastUserId = lastAuthStateRef.current.userId;
    const lastAuthenticated = lastAuthStateRef.current.isAuthenticated;

    // Determine if we need to reconnect
    const needsReconnection = 
      isAuthenticated !== lastAuthenticated || // Auth status changed
      currentUserId !== lastUserId || // User changed
      (isAuthenticated && socketsRef.current.length === 0); // No sockets but should have them

    // Update tracking refs
    lastAuthStateRef.current = { isAuthenticated, userId: currentUserId };
    lastUserRef.current = user;

    if (!needsReconnection) {
      console.log('Socket Provider: No reconnection needed, maintaining existing connections');
      return;
    }

    console.log('Socket Provider: Reconnection needed', {
      authChanged: isAuthenticated !== lastAuthenticated,
      userChanged: currentUserId !== lastUserId,
      hasNoSockets: socketsRef.current.length === 0,
      isAuthenticated,
      currentUserId
    });

    // Cleanup previous sockets
    if (socketsRef.current.length > 0) {
      console.log('Socket Provider: Cleaning up existing sockets');
      socketsRef.current = cleanupSockets(socketsRef.current);
    }

    // Don't connect if user is not authenticated
    if (!isAuthenticated || !user) {
      console.log('Socket Provider: User not authenticated, skipping socket initialization');
      return;
    }

    // Initialize sockets
    console.log('Socket Provider: Initializing sockets for user:', currentUserId);
    
    try {
      const socketConfigs = createSocketConfigs(navigateRef.current);
      const enabledConfigs = getEnabledConfigs(socketConfigs);
      const environmentConfig = getEnvironmentConfig();

      enabledConfigs.forEach((config) => {
        if (!validateSocketConfig(config)) {
          console.warn(`Skipping invalid socket config: ${config.id}`);
          return;
        }

        try {
          const socket = createSocket(config, user, environmentConfig);
          setupSocketEvents(socket, config.events);
          socketsRef.current.push(socket);
          console.log(`Initialized socket: ${config.name} (${config.id})`);
        } catch (error) {
          console.error(`Failed to initialize socket ${config.id}:`, error);
        }
      });

      // Log connection status for debugging
      if (import.meta.env.MODE === 'development') {
        setTimeout(() => {
          const status = getSocketStatus(socketsRef.current);
          console.log('Socket connections status:', status);
        }, 1000);
      }
    } catch (error) {
      console.error('Socket Provider: Error during socket initialization:', error);
    }

    // Cleanup function - only runs when component unmounts or dependencies change
    return () => {
      console.log('Socket Provider: Cleanup triggered');
      socketsRef.current = cleanupSockets(socketsRef.current);
    };
  }, [isAuthenticated, user]); // Only depend on auth state and user

  return children;
}

// Export both versions for choice
export { default as SocketProvider } from "./SocketProvider.jsx";
export { default as SocketProviderOptimized } from "./SocketProvider.jsx";