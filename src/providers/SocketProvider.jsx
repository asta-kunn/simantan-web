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
 * Enhanced Socket Provider
 * 
 * Manages multiple socket connections with different API URLs and configurations.
 * Supports dynamic socket management, environment-specific settings, and
 * easy addition of new socket services.
 */

export default function SocketProvider({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const socketsRef = useRef([]);
  const navigateRef = useRef(navigate);

  // Keep navigate ref updated
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    // Cleanup previous sockets if any
    socketsRef.current = cleanupSockets(socketsRef.current);

    // Don't connect if user is not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Get socket configurations - use ref to avoid dependency
    const socketConfigs = createSocketConfigs(navigateRef.current);
    const enabledConfigs = getEnabledConfigs(socketConfigs);
    const environmentConfig = getEnvironmentConfig();

    // Create and setup sockets
    enabledConfigs.forEach((config) => {
      // Validate configuration
      if (!validateSocketConfig(config)) {
        console.warn(`Skipping invalid socket config: ${config.id}`);
        return;
      }

      try {
        // Create socket connection
        const socket = createSocket(config, user, environmentConfig);
        
        // Setup event handlers
        setupSocketEvents(socket, config.events);

        // Add to tracked sockets
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

    // Cleanup function
    return () => {
      socketsRef.current = cleanupSockets(socketsRef.current);
    };
  }, [isAuthenticated, user]); // Removed navigate from dependencies

  return children;
}
