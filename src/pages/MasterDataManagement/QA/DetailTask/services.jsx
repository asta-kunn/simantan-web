import mainInstance from "@/api/instances/main.instance";

const login = async (payload) => {
  try {
    const response = await mainInstance.post(`/auth/login`, payload);
    console.log({ response });
    const { success, data, message } = response?.data;

    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

const logout = async (payload) => {
  try {
    const { success, data, message } = await mainInstance.post(
      `/auth/logout`,
      payload
    );
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export default {
  login,
  logout,
};
