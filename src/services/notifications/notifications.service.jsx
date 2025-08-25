import mainInstance from "@/api/instances/main.instance";

export const putNotificationAsRead = async (ids) => {
  return await mainInstance.put(`/notifications`, { ids });
};

export const getNotifications = async () => {
  return await mainInstance.get('/notifications');
};