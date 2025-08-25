import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, X } from "lucide-react";
import { Button } from "@/components/Dexain";
import { Input } from "@/components/fields/Input";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import useNotificationStore from "@/stores/notificationStore";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/notifications/useNotifications";
import { transformNotification as normalizeNotification } from "@/config/socket.config.jsx";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotificationsStore = useNotificationStore(
    (state) => state.setNotifications
  );
  const markReadLocal = useNotificationStore((state) => state.markReadLocal);
  const navigate = useNavigate();

  // Query notifications from API when dropdown opened
  const { markNotificationAsRead } = useMarkNotificationAsRead();
  const { notifications: apiNotifications = [] } = useGetNotifications(showNotifications);

  // Use shared normalizer to keep IDs consistent between API and socket
  const transformNotification = normalizeNotification;

  // sync apiNotifications into local list whenever they change
  useEffect(() => {
    if (apiNotifications && apiNotifications.length) {
      const formatted = apiNotifications
        .map(transformNotification)
        .filter(Boolean)
        .map((n) => ({ ...n, id: String(n.id) }));

      const map = new Map();
      // Put existing first so API can update fields but keep newer ones
      for (const n of notifications) {
        if (!n?.id) continue;
        map.set(String(n.id), n);
      }
      for (const n of formatted) {
        if (!n?.id) continue;
        map.set(String(n.id), { ...map.get(String(n.id)), ...n });
      }

      const sorted = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotificationsStore(sorted);
    }
  }, [apiNotifications]);

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = async (notification) => {
    // Mark as read in backend / state
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
      markReadLocal(notification.id);
    }

    // Navigate if url exists
    if (notification.url) {
      const submissionId = notification.parameter?.submissionId;
      const registrationType = notification.parameter?.registrationType;
      navigate(notification.url, {
        state: { submissionId, registrationType },
      });
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    try {
      await markNotificationAsRead(unread.map((n) => n.id));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }

    useNotificationStore.getState().markAllReadLocal();
  };

  const handleClickOutside = (e) => {
    if (showNotifications && !e.target.closest(".notification-container")) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="relative notification-container">
      <div className="relative">
        <Button
          className="p-3 bg-tertiary-normal hover:bg-primary-soft"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-4 w-4 text-primary-normal" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-3 bg-secondary-normal text-white text-[7px] rounded-full h-2 w-2 flex items-center justify-center"></span>
          )}
        </Button>
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      className="text-xs text-primary-normal hover:text-primary-normal-hover"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    prefix={<Search className="h-4 w-4" />}
                    suffix={
                      searchQuery ? (
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => setSearchQuery("")}
                        />
                      ) : null
                    }
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-2">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors flex items-start gap-3 ${!notification.read ? "bg-primary-soft/20" : ""}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {/* Bagian Ikon */}
                          <div className="relative mt-1 text-primary-normal">
                            {notification.icon && (
                              <motion.i
                                className={`${notification.icon} ${notification.read ? "text-primary-normal" : "text-primary-normal"} text-xl`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                              ></motion.i>
                            )}
                            {/* {!notification.read && (
                              <span className="absolute -top-1 -right-1 bg-primary-normal rounded-full h-2 w-2"></span>
                            )} */}
                          </div>

                          {/* Bagian Teks */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5 whitespace-normal">
                              {notification.description}
                            </p>
                            <p
                              className={`text-xs mt-1.5 ${!notification.read ? "text-primary-normal font-semibold" : "text-gray-500"}`}
                            >
                              {dayjs(notification.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No notifications found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notification;
