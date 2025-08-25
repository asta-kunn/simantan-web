import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, putNotificationAsRead } from "@/services/notifications/notifications.service";

/**
 * Hook untuk mengambil daftar notifikasi.
 * @param {boolean} enabled - fetch saat true (mis. dropdown dibuka)
 */
export const useGetNotifications = (enabled = false) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled,
    staleTime: 1000 * 60, // 1 menit
  });


  return {
    notifications: data,
    isLoadingNotifications: isLoading,
    errorNotifications: error,
    refetchNotifications: refetch,
  };
};

/**
 * Hook untuk menandai notifikasi sebagai sudah dibaca.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, error, reset } = useMutation({
    mutationFn: async (ids) => {
      if (!ids.length) throw new Error("Notification ID required");
      await putNotificationAsRead(ids);
      return ids;
    },
    onSuccess: () => {
      // invalidate agar refresh list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    markNotificationAsRead: mutateAsync,
    isLoadingMarkNotification: isLoading,
    errorMarkNotification: error,
    resetMarkNotification: reset,
  };
};
