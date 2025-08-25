import { useQuery } from "@tanstack/react-query";

import { fetchTotalTaskItemSubstitution } from "@/services/master-data-management/technical-service.service";

export const useCountTaskItemSubstitution = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks-count-item-substitution"],
    queryFn: fetchTotalTaskItemSubstitution,
  });



  return {
    totalTaskItemSubstitution: data?.data || 0,
    isLoadingItemSubstitution: isLoading,
    errorItemSubstitution: error,
    refetchItemSubstitution: refetch,
  };
};
