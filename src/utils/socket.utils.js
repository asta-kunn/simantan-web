/**
 * Socket Utilities
 *
 * Utility functions for socket management, connection handling,
 * and common socket operations.
 */

import { io } from "socket.io-client";

/**
 * Create and configure a socket connection
 * @param {Object} config - Socket configuration
 * @param {Object} user - User information
 * @param {Object} environmentConfig - Environment-specific configuration
 * @returns {Object} Socket instance
 */
export const createSocket = (config, user, environmentConfig = {}) => {
  const { apiUrl, namespace, path, options = {} } = config;

  // Get user identifiers
  const email = user?.EMAIL || user?.USER_EMAIL || user?.email;
  const userId = user?.USER_ID || user?.ID || user?.id;

  // Parse the API URL to get the origin
  const { origin } = new URL(apiUrl, window.location.origin);

  // Combine options with environment config
  const socketOptions = {
    ...environmentConfig,
    ...options,
    path,
    query: {
      email,
      userId: String(userId),
      ...options.query,
    },
  };

  // Create socket connection
  const socketUrl = `${origin}/${namespace}`;
  const socket = io(socketUrl, socketOptions);

  // Add metadata to socket for debugging
  socket.meta = {
    id: config.id,
    name: config.name,
    url: socketUrl,
    namespace,
  };

  return socket;
};

/**
 * Setup event handlers for a socket
 * @param {Object} socket - Socket instance
 * @param {Array} events - Array of event configurations
 */
export const setupSocketEvents = (socket, events = []) => {
  events.forEach(({ event, handler }) => {
    socket.on(event, handler);
  });

  // Setup default error handling
  socket.on("connect_error", (err) => {
    console.error(
      `Socket ${socket.meta?.name || "Unknown"} connection error:`,
      err
    );
    // Log for debugging if enabled
    if (typeof window !== "undefined" && window.socketDebug) {
      const { logSocketEvent } = require("./socket.debug");
      logSocketEvent?.("socket_connection_error", {
        socketId: socket.meta?.id,
        socketName: socket.meta?.name,
        error: err.message,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.warn(
      `Socket ${socket.meta?.name || "Unknown"} disconnected:`,
      reason
    );
    // Log for debugging if enabled
    if (typeof window !== "undefined" && window.socketDebug) {
      const { logSocketEvent } = require("./socket.debug");
      logSocketEvent?.("socket_disconnected", {
        socketId: socket.meta?.id,
        socketName: socket.meta?.name,
        reason,
      });
    }
  });

  socket.on("connect", () => {
    console.log(
      `Socket ${socket.meta?.name || "Unknown"} connected successfully`
    );
    // Log for debugging if enabled
    if (typeof window !== "undefined" && window.socketDebug) {
      const { logSocketEvent } = require("./socket.debug");
      logSocketEvent?.("socket_connected", {
        socketId: socket.meta?.id,
        socketName: socket.meta?.name,
        url: socket.meta?.url,
      });
    }
  });
};

/**
 * Cleanup socket connections
 * @param {Array} sockets - Array of socket instances
 */
export const cleanupSockets = (sockets = []) => {
  sockets.forEach((socket) => {
    if (socket && typeof socket.disconnect === "function") {
      socket.disconnect();
    }
  });
  return [];
};

/**
 * Filter enabled socket configurations
 * @param {Array} configs - Array of socket configurations
 * @returns {Array} Filtered configurations
 */
export const getEnabledConfigs = (configs = []) => {
  return configs.filter((config) => {
    // If no enabled function is provided, assume it's enabled
    if (typeof config.enabled !== "function") {
      return true;
    }

    try {
      return config.enabled();
    } catch (error) {
      console.warn(`Error checking if socket ${config.id} is enabled:`, error);
      return false;
    }
  });
};

/**
 * Validate socket configuration
 * @param {Object} config - Socket configuration
 * @returns {boolean} Whether configuration is valid
 */
export const validateSocketConfig = (config) => {
  const required = ["id", "name", "apiUrl", "namespace"];
  const missing = required.filter((field) => !config[field]);

  if (missing.length > 0) {
    console.error(
      `Socket config ${config.id || "unknown"} missing required fields:`,
      missing
    );
    return false;
  }

  if (!Array.isArray(config.events)) {
    console.error(`Socket config ${config.id} events must be an array`);
    return false;
  }

  // Validate each event
  for (const event of config.events) {
    if (!event.event || typeof event.handler !== "function") {
      console.error(`Socket config ${config.id} has invalid event:`, event);
      return false;
    }
  }

  return true;
};

/**
 * Get socket connection status
 * @param {Array} sockets - Array of socket instances
 * @returns {Object} Connection status summary
 */
export const getSocketStatus = (sockets = []) => {
  const status = {
    total: sockets.length,
    connected: 0,
    connecting: 0,
    disconnected: 0,
    details: [],
  };

  sockets.forEach((socket) => {
    const socketInfo = {
      id: socket.meta?.id || "unknown",
      name: socket.meta?.name || "Unknown",
      url: socket.meta?.url || "Unknown",
      status: socket.connected ? "connected" : "disconnected",
    };

    status.details.push(socketInfo);

    if (socket.connected) {
      status.connected++;
    } else {
      status.disconnected++;
    }
  });

  return status;
};

/**
 * Manually connect specific sockets
 * @param {Array} sockets - Array of socket instances
 * @param {Array} socketIds - Array of socket IDs to connect
 */
export const connectSpecificSockets = (sockets = [], socketIds = []) => {
  sockets.forEach((socket) => {
    if (socketIds.includes(socket.meta?.id) && !socket.connected) {
      socket.connect();
    }
  });
};

/**
 * Manually disconnect specific sockets
 * @param {Array} sockets - Array of socket instances
 * @param {Array} socketIds - Array of socket IDs to disconnect
 */
export const disconnectSpecificSockets = (sockets = [], socketIds = []) => {
  sockets.forEach((socket) => {
    if (socketIds.includes(socket.meta?.id) && socket.connected) {
      socket.disconnect();
    }
  });
};
