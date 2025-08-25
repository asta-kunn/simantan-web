import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Example 1: Basic Notification Socket
export const notificationSocketExample = {
  id: 'notifications',
  name: 'Notification Service',
  apiUrl: import.meta.env.VITE_API_URL_NOTIFICATIONS || window.location.origin,
  namespace: 'notifications',
  events: [
    {
      event: 'notification',
      handler: (payload) => {
        toast({
          title: payload.title,
          description: payload.message,
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
  }
};

// Example 2: Real-time Chat Socket
export const chatSocketExample = {
  id: 'chat',
  name: 'Chat Service',
  apiUrl: import.meta.env.VITE_API_URL_CHAT || window.location.origin,
  namespace: 'chat',
  events: [
    {
      event: 'message',
      handler: (payload) => {
        // Handle incoming chat message
        console.log('New message:', payload);
        // You can dispatch to a chat store here
      }
    },
    {
      event: 'user-joined',
      handler: (payload) => {
        toast({
          title: 'User Joined',
          description: `${payload.username} joined the chat`,
        });
      }
    },
    {
      event: 'user-left',
      handler: (payload) => {
        toast({
          title: 'User Left',
          description: `${payload.username} left the chat`,
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
  enabled: () => import.meta.env.VITE_ENABLE_CHAT === 'true'
};

// Example 3: File Upload Progress Socket
export const fileUploadSocketExample = {
  id: 'file-upload',
  name: 'File Upload Service',
  apiUrl: import.meta.env.VITE_API_URL_FILES || window.location.origin,
  namespace: 'file-upload',
  events: [
    {
      event: 'upload-progress',
      handler: (payload) => {
        // Handle upload progress
        const { fileId, progress } = payload;
        // Update progress in your upload store
        console.log(`File ${fileId} upload progress: ${progress}%`);
      }
    },
    {
      event: 'upload-complete',
      handler: (payload) => {
        toast({
          title: 'Upload Complete',
          description: `File ${payload.filename} uploaded successfully`,
          action: (
            <ToastAction altText="View" onClick={() => {
              // Navigate to file or open file viewer
              window.open(payload.url, '_blank');
            }}>
              View
            </ToastAction>
          ),
        });
      }
    },
    {
      event: 'upload-error',
      handler: (payload) => {
        toast({
          title: 'Upload Failed',
          description: payload.error,
          variant: 'destructive'
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: false, // Connect only when uploading
  }
};

// Example 4: System Monitoring Socket
export const systemMonitoringSocketExample = {
  id: 'system-monitoring',
  name: 'System Monitoring',
  apiUrl: import.meta.env.VITE_API_URL_MONITORING || window.location.origin,
  namespace: 'system',
  events: [
    {
      event: 'server-status',
      handler: (payload) => {
        if (payload.status === 'down') {
          toast({
            title: 'Server Alert',
            description: `${payload.service} is experiencing issues`,
            variant: 'destructive'
          });
        }
      }
    },
    {
      event: 'maintenance-mode',
      handler: (payload) => {
        toast({
          title: 'Maintenance Notice',
          description: `System maintenance scheduled: ${payload.scheduledTime}`,
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
    reconnectionDelay: 5000,
  },
  enabled: () => {
    // Only enable for admin users
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }
};

// Example 5: Real-time Data Updates Socket
export const dataUpdatesSocketExample = {
  id: 'data-updates',
  name: 'Real-time Data Updates',
  apiUrl: import.meta.env.VITE_API_URL_DATA || window.location.origin,
  namespace: 'data-updates',
  events: [
    {
      event: 'product-updated',
      handler: (payload) => {
        // Handle product data updates
        // You might want to update your product store here
        console.log('Product updated:', payload);
      }
    },
    {
      event: 'inventory-changed',
      handler: (payload) => {
        // Handle inventory changes
        console.log('Inventory changed:', payload);
      }
    },
    {
      event: 'price-updated',
      handler: (payload) => {
        toast({
          title: 'Price Update',
          description: `Price updated for ${payload.productName}`,
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
  }
};

// Example 6: Geographic/Location Socket (for delivery tracking, etc.)
export const locationSocketExample = {
  id: 'location-tracking',
  name: 'Location Tracking',
  apiUrl: import.meta.env.VITE_API_URL_LOCATION || window.location.origin,
  namespace: 'location',
  events: [
    {
      event: 'delivery-update',
      handler: (payload) => {
        toast({
          title: 'Delivery Update',
          description: `Your order is ${payload.status}`,
        });
      }
    },
    {
      event: 'driver-location',
      handler: (payload) => {
        // Update driver location on map
        console.log('Driver location:', payload);
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
  enabled: () => import.meta.env.VITE_ENABLE_LOCATION_TRACKING === 'true'
};

// Example 7: Custom Business Logic Socket
export const approvalWorkflowSocketExample = {
  id: 'approval-workflow',
  name: 'Approval Workflow',
  apiUrl: import.meta.env.VITE_API_URL_WORKFLOW || import.meta.env.VITE_API_URL_MAIN || window.location.origin,
  namespace: 'workflow',
  events: [
    {
      event: 'approval-request',
      handler: (payload) => {
        toast({
          title: 'Approval Required',
          description: `${payload.type} requires your approval`,
          action: (
            <ToastAction altText="Review" onClick={() => {
              // Navigate to approval page
              window.location.href = `/approval/${payload.id}`;
            }}>
              Review
            </ToastAction>
          ),
        });
      }
    },
    {
      event: 'approval-completed',
      handler: (payload) => {
        toast({
          title: 'Approval Completed',
          description: `${payload.type} has been ${payload.status}`,
        });
      }
    }
  ],
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
  enabled: () => {
    // Enable only for users with approval permissions
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.permissions?.includes('approve') || user.role === 'approver';
  }
};

/**
 * How to add a new socket configuration:
 * 
 * 1. Create your configuration object following the examples above
 * 2. Add it to the createSocketConfigs function in socket.config.js
 * 3. Add any necessary environment variables to your .env files
 * 4. Test the connection in development mode
 * 
 * Required fields:
 * - id: Unique identifier for the socket
 * - name: Human-readable name for debugging
 * - apiUrl: The API endpoint URL
 * - namespace: Socket namespace on the server
 * - events: Array of event configurations with { event, handler }
 * 
 * Optional fields:
 * - options: Socket.io connection options
 * - enabled: Function that returns boolean to conditionally enable
 */