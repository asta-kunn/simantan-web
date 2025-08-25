/**
 * Custom Hook for Socket Management
 * 
 * Provides utilities for interacting with socket connections
 * and managing socket state within components.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createSocket, setupSocketEvents, cleanupSockets } from '@/utils/socket.utils';
import { getEnvironmentConfig } from '@/config/socket.config';
import useAuthStore from '@/stores/authStore';

/**
 * Hook for managing individual socket connections
 * @param {Object} config - Socket configuration
 * @param {boolean} enabled - Whether to connect automatically
 * @returns {Object} Socket management utilities
 */
export const useSocket = (config, enabled = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const connect = useCallback(() => {
    if (!config || !user || !isAuthenticated) {
      return;
    }

    try {
      // Cleanup existing connection
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // Create new connection
      const environmentConfig = getEnvironmentConfig();
      const socket = createSocket(config, user, environmentConfig);

      // Setup events
      setupSocketEvents(socket, config.events);

      // Add connection status handlers
      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('connect_error', (err) => {
        setError(err.message);
        setIsConnected(false);
      });

      socketRef.current = socket;
    } catch (err) {
      setError(err.message);
    }
  }, [config, user, isAuthenticated]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  // Auto-connect when enabled and user is authenticated
  useEffect(() => {
    if (enabled && isAuthenticated && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, isAuthenticated, user, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off
  };
};

/**
 * Hook for managing multiple socket connections
 * @param {Array} configs - Array of socket configurations
 * @returns {Object} Multi-socket management utilities
 */
export const useMultiSocket = (configs = []) => {
  const [connections, setConnections] = useState({});
  const socketsRef = useRef([]);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const connectAll = useCallback(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Cleanup existing connections
    socketsRef.current = cleanupSockets(socketsRef.current);
    
    const newConnections = {};
    const environmentConfig = getEnvironmentConfig();

    configs.forEach((config) => {
      try {
        const socket = createSocket(config, user, environmentConfig);
        setupSocketEvents(socket, config.events);

        socket.on('connect', () => {
          setConnections(prev => ({
            ...prev,
            [config.id]: { ...prev[config.id], connected: true, error: null }
          }));
        });

        socket.on('disconnect', () => {
          setConnections(prev => ({
            ...prev,
            [config.id]: { ...prev[config.id], connected: false }
          }));
        });

        socket.on('connect_error', (err) => {
          setConnections(prev => ({
            ...prev,
            [config.id]: { ...prev[config.id], connected: false, error: err.message }
          }));
        });

        socketsRef.current.push(socket);
        newConnections[config.id] = {
          socket,
          config,
          connected: false,
          error: null
        };

      } catch (error) {
        newConnections[config.id] = {
          socket: null,
          config,
          connected: false,
          error: error.message
        };
      }
    });

    setConnections(newConnections);
  }, [configs, isAuthenticated, user]);

  const disconnectAll = useCallback(() => {
    socketsRef.current = cleanupSockets(socketsRef.current);
    setConnections({});
  }, []);

  const getSocket = useCallback((socketId) => {
    return connections[socketId]?.socket;
  }, [connections]);

  const emit = useCallback((socketId, event, data) => {
    const socket = getSocket(socketId);
    if (socket && connections[socketId]?.connected) {
      socket.emit(event, data);
    }
  }, [getSocket, connections]);

  useEffect(() => {
    if (isAuthenticated && user && configs.length > 0) {
      connectAll();
    }

    return () => {
      disconnectAll();
    };
  }, [isAuthenticated, user, configs, connectAll, disconnectAll]);

  return {
    connections,
    connectAll,
    disconnectAll,
    getSocket,
    emit
  };
};

/**
 * Hook for socket connection status monitoring
 * @param {Array} socketIds - Array of socket IDs to monitor
 * @returns {Object} Connection status information
 */
export const useSocketStatus = (socketIds = []) => {
  const [status, setStatus] = useState({
    total: 0,
    connected: 0,
    disconnected: 0,
    errors: 0
  });

  // This would need to be implemented based on your specific socket management
  // For now, it's a placeholder that could be extended
  
  return status;
};