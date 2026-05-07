import api from "./api";

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications/');
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/notifications/${notificationId}/mark_read/`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
