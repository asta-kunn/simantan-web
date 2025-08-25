import { getCountProductRegistrationTasks } from "@/services/product-registration/homepage/homepage.service";
import { useQuery } from "@tanstack/react-query";

export const useCountTask = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks-count"],
    queryFn: () => getCountProductRegistrationTasks(),
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
