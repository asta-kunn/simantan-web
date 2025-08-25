import {
  getMarketingAuthorizationDatabaseById,
  getMarketingAuthorizationDatabaseVersionByDescription,
  getMarketingAuthorizationDatabaseDetail,
  postMarketingAuthorizationDatabaseFilter,
  getMarketingAuthorizationDatabaseDistinct,
} from "@/services/product-registration/marketing-authorization-database/marketing-authorization-database.service";
import { getMarketingAuthorizationDatabaseAccess } from "@/services/product-registration/marketing-authorization-database/marketing-authorization-user.service";
import { useQuery, useMutation } from "@tanstack/react-query";


export const useGetMarketingAuthorizationDatabaseVersionByDescription = (finished_product_description) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["detail-nie-version", finished_product_description],
    queryFn: () => getMarketingAuthorizationDatabaseVersionByDescription(finished_product_description),
    enabled: !!finished_product_description, // penting agar tidak fetch jika finished_product_description undefined/null
  });

  if (error) console.error("[useDetailMarketingAuthorizationDatabaseDatabase] Error:", error);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetMarketingAuthorizationDatabaseById = (version, id, description) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["detail-nie-database", id],
    queryFn: () => getMarketingAuthorizationDatabaseById(version, id, description),
    enabled: !!id, // penting agar tidak fetch jika id undefined/null
  });

  if (error) console.error("[useDetailMarketingAuthorizationDatabaseDatabase] Error:", error);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetMarketingAuthorizationDatabaseDetail = (version, finished_product_description) => {
  const isValidVersion = Number.isFinite(Number(version));

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["nie-detail-by-version-and-description", version, finished_product_description],
    queryFn: () => getMarketingAuthorizationDatabaseDetail(version, finished_product_description),
    enabled: isValidVersion && !!finished_product_description, // ✅ prevent if version is invalid
  });

  if (error) console.error("[useMarketingAuthorizationDatabaseDetailByVersionAndDescription] Error:", error);

  console.log("data response", data);
  return {
    data,
    isLoading,
    error,
    refetch,
    isValidVersion,
  };
};

export const useGetMarketingAuthorizationDatabaseAccess = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["nie-access"],
    queryFn: () => getMarketingAuthorizationDatabaseAccess(),
  });

  if (error) console.error("[useMarketingAuthorizationDatabaseAccess] Error:", error);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const usePostMarketingAuthorizationDatabaseFilter = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => postMarketingAuthorizationDatabaseFilter(data),
  });

  if (error) console.error("[usePostMarketingAuthorizationFilter] Error:", error);

  return {
    filteredData: mutateAsync,
    isLoadingFilteredData: isLoading,
    errorFilteredData: error,
    refetchFilteredData: refetch,
  };
};

export const useGetMarketingAuthorizationDatabaseDistinct = (field) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["marketing-authorization-distinct", field],
    queryFn: () => getMarketingAuthorizationDatabaseDistinct(field),
    enabled: !!field, // ✅ prevent if field is undefined/null
  });

  if (error) console.error("[useGetMarketingAuthorizationDatabaseDistinct] Error:", error);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
