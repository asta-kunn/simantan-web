import {
  getChangeType,
  getCommitmentTypes,
  getCountries,
  getDevelopmentCategories,
  getFinishedProducts,
  getMAHolders,
  getMilis,
  getPharmaceuticalForms,
  getProductCategories,
  getProjectTasks,
  getRegistrationEmailTemplate,
  getRoles,
  getUsers,
  getOrganizations,
  getActiveIngredientsMaster,
} from "@/services/master-data.service";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (params) => {
  const {
    data,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });

  return {
    users: data,
    isLoading: isLoadingUsers,
    error: errorUsers,
  };
};

export const useGetRoles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  return {
    roles: data,
    isLoadingRoles: isLoading,
    errorRoles: error,
  };
};

export const useGetMilis = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["milis"],
    queryFn: () => getMilis(),
  });

  return {
    milis: data,
    isLoadingMilis: isLoading,
    errorMilis: error,
  };
};

export const useGetItemFinishedProduct = (params) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items-finished-product"],
    queryFn: () => getFinishedProducts(params),
  });

  return {
    data: data?.data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetCountries = (enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items-countries"],
    queryFn: () => getCountries(),
    enabled,
  });

  // console.log("[ITEM COUNTRY", data);

  return {
    countries: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetFinishedProducts = (name) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items-finished-products-search", name],
    queryFn: () => getFinishedProducts(name),
    enabled: !!name,
  });

  return {
    finishedProductsData: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetChangeType = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items-change-type"],
    queryFn: () => getChangeType(),
  });

  return {
    changeTypeData: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetProjectTasks = (params) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items-project-tasks", params],
    queryFn: () => getProjectTasks(params),
  });

  return {
    projectTasksData: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetMAHolders = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ma-holders"],
    queryFn: () => getMAHolders(),
  });

  return {
    maHolders: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetDevelopmentCategories = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["development-categories"],
    queryFn: () => getDevelopmentCategories(),
  });

  return {
    developmentCategories: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetPharmaceuticalForms = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pharmaceutical-forms"],
    queryFn: () => getPharmaceuticalForms(),
  });

  return {
    pharmaceuticalForms: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetProductCategories = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => getProductCategories(),
  });

  return {
    productCategories: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetCommitmentTypes = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["commitment-types"],
    queryFn: () => getCommitmentTypes(),
  });

  return {
    commitmentTypes: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetRegistrationEmailTemplate = (payload) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["registration-email-template", payload],
    queryFn: () => getRegistrationEmailTemplate(payload),
  });

  return {
    registrationEmailTemplate: data,
    isLoadingRegistrationEmailTemplate: isLoading,
    errorRegistrationEmailTemplate: error,
    refetchRegistrationEmailTemplate: refetch,
  };
};

export const useGetOrganizations = (enabled = true) => {
  const {
    data: organizations,
    isLoading: isLoadingOrganizations,
    error: errorOrganizations,
    refetch: refetchOrganizations,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getOrganizations(),
    enabled,
  });

  return {
    organizations,
    isLoadingOrganizations,
    errorOrganizations,
    refetchOrganizations,
  };
};

export const useGetActiveIngredientsMaster = (enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["active-ingredients-master"],
    queryFn: () => getActiveIngredientsMaster(),
    enabled,
  });

  return {
    activeIngredients: data,
    isLoadingActiveIngredients: isLoading,
    errorActiveIngredients: error,
    refetchActiveIngredients: refetch,
  };
};
