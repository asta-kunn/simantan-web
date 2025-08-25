import { patchAddProjectTaskVersion, patchProjectTaskData } from "@/services/product-registration/new-product-registration/submission.service";
import { getUnassignedTasks, postAssignTask, postNewTask } from "@/services/product-registration/new-product-registration/task.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUnassignedTasks = (filterType = "", keyword = "") => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["unassigned-tasks", filterType, keyword],
    queryFn: () => getUnassignedTasks({ type: filterType, keyword }),
    keepPreviousData: true,
    enabled: false,
  });

  return {
    unassignedTasks: data,
    isLoadingUnassignedTasks: isLoading,
    errorUnassignedTasks: error,
    refetchUnassignedTasks: refetch,
  };
};

export const usePostNewTask = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => postNewTask(data),
  });

  return {
    postNewTask: mutateAsync,
    isLoadingPostNewTask: isLoading,
    errorPostNewTask: error,
    refetchPostNewTask: refetch,
  };
};

export const usePostAssignTask = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => postAssignTask(data),
  });

  return {
    postAssignTask: mutateAsync,
    isLoadingPostAssignTask: isLoading,
    errorPostAssignTask: error,
    refetchPostAssignTask: refetch,
  };
};

export const usePatchProjectTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => patchProjectTaskData(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task"] }),
  });
};

export const usePatchAddProjectTaskVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => patchAddProjectTaskVersion(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task"] }),
  });
};