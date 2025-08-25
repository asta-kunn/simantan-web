import productRegistrationInstance from "@/api/instances/product-registration.instance";

export const getCountProductRegistrationTasks = async () => {
  return await productRegistrationInstance.get(`/homepage/count-tasks`);
};