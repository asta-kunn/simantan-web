import { useQuery } from "@tanstack/react-query";

import { fetchTotalTask } from "@/services/master-data-management/technical-service.service";

export const useCountTaskApprovedVendorList = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks-count-approved-vendor-list"],
    queryFn: () => fetchTotalTask(),
  });

  return {
    totalTaskApprovedVendorList: data?.data?.TOTAL_TASK || 0,
    isLoadingApprovedVendorList: isLoading,
    errorApprovedVendorList: error,
    refetchApprovedVendorList: refetch,
  };
};
