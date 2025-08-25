import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import useNotificationStore from "@/stores/notificationStore";
import { putNotificationAsRead } from "@/services/notifications/notifications.service";
import useAuthStore from "@/stores/authStore";

// --- Helper Functions ---
export const transformNotification = (data) => {
  if (!data) return null;

  const idValue = data.NOTIFICATION_ID ?? data.id;
  const id = idValue == null ? undefined : String(idValue);

  return {
    id,
    title: data.TITLE ?? data.title ?? "Notification",
    description: data.CONTENT ?? data.description ?? "",
    url: data.URL ?? data.url,
    createdAt: data.CREATED_AT ?? data.createdAt ?? new Date().toISOString(),
    read: (data.IS_READ === "Y") || (data.read === true),
    parameter: data.PARAMETER ?? data.parameter ?? {},
    icon: data.ICON ?? data.icon ?? "",
  };
};

export const createNotificationHandler = (navigate) => (payload) => {
  const user = useAuthStore.getState()?.user;
  const userEmail = user?.EMAIL || user?.USER_EMAIL || user?.email;
  const userId = String(user?.USER_ID || user?.ID || user?.id || "");

  const items = Array.isArray(payload) ? payload : [payload];
  const mine = items.filter((item) => {
    const toValue = item?.TO != null ? String(item.TO) : "";
    return toValue === userEmail || toValue === userId;
  });

  if (mine.length === 0) return;

  const { addNotification } = useNotificationStore.getState();

  mine.forEach((raw) => {
    const notif = transformNotification(raw);
    if (!notif?.id) return;
    addNotification(notif);

    toast({
      title: notif.title,
      description: notif.description,
      action: (
        <ToastAction
          altText="Open"
          onClick={async () => {
            useNotificationStore.getState().markReadLocal(notif.id);

            try {
              await putNotificationAsRead(notif.id);
            } catch (err) {
              console.error("Failed to mark notification as read:", err);
            }

            if (notif.url) {
              navigate(notif.url, {
                state: {
                  submissionId: notif.parameter?.submissionId,
                  registrationType: notif.parameter?.registrationType,
                }
              });
            }
          }}
        >
          Open
        </ToastAction>
      ),
    });
  });
};

export const createSocketConfigs = (navigate) => [
  {
    id: "notif",
    name: "notifications",
    apiUrl: import.meta.env.VITE_WEBSOCKET_URL || window.location.origin,
    namespace: "events",
    path: `${import.meta.env.VITE_NODE_ENV !== "master" ? `/${import.meta.env.VITE_NODE_ENV}` : ""}/ws`,
    events: [
      {
        event: "notification",
        handler: createNotificationHandler(navigate),
      },
    ],
    options: {
      transports: ["websocket"],
      autoConnect: true,
    },
  },
];

export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || "develop";

  const configs = {
    develop: {
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    },
    uat: {
      reconnectionDelay: 2000,
      reconnectionAttempts: 3,
      timeout: 30000,
    },
    master: {
      reconnectionDelay: 5000,
      reconnectionAttempts: 3,
      timeout: 30000,
    },
  };

  return configs[env] || configs.develop;
};
