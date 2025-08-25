import {  getItemMasterUnmapped,  putItemMaster, postItemMaster, postItemMasterSearch } from "@/services/master-data-management/item-master.service";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useGetItemMasterUnmapped = (itemMasterDescription) => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["list-item-master-unmapped", itemMasterDescription],
    queryFn: () => getItemMasterUnmapped(itemMasterDescription),
  });

  const data = response?.data?.data ?? [];

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};


export const usePutItemMaster = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => putItemMaster(data),
  });

  if (error) console.error("[usePutItemMaster] Error:", error);

  return {
    putItemMaster: mutateAsync,
    isLoadingPutItemMaster: isLoading,
    errorPutItemMaster: error,
    refetchPutItemMaster: refetch,
  };
};

export const usePostItemMaster = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => postItemMaster(data),
  });

  if (error) console.error("[usePostItemMaster] Error:", error);

  return {
    postItemMaster: mutateAsync,
    isLoadingPostItemMaster: isLoading,
    errorPostItemMaster: error,
    refetchPostItemMaster: refetch,
  };
};

export const usePostItemMasterSearch = () => {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: (data) => postItemMasterSearch(data),
  });

  if (error) console.error("[usePostItemMasterSearch] Error:", error);

  return {
    searchItemMaster: mutateAsync,
    isLoadingSearch: isLoading,
    errorSearch: error,
  };
};

