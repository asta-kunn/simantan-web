import mainInstance from "@/api/instances/main.instance";

export function useMutation({ url, payload }) {
  const mutation = async () => {
    try {
      const result = await mainInstance.post(url, payload);
      return result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutate = async (payload) => {
    try {
      const result = await mainInstance.post(url, payload);
      return result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { mutation, mutate };
}
