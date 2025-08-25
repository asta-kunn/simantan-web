import { patchAddProjectTaskVersion, patchProjectTaskData } from "@/services/product-registration/registration-variation-notification/subsmission.service";
import { deleteTask, getAllTasks, postAssignTask, postNewTask } from "@/services/product-registration/registration-variation-notification/task.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";


export const useGetAllTasks = (initialParams) => {
  const [currentParams, setCurrentParams] = useState(initialParams);
  const [triggerRefetch, setTriggerRefetch] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch: originalRefetch } = useQuery({
    queryKey: ["task", currentParams, triggerRefetch],
    queryFn: () => getAllTasks(currentParams),
  });

  // Custom refetch function that accepts parameter overrides
  const refetch = useCallback(async (typeOverride = null, keywordOverride = null) => {
    // If overrides are provided, use them
    if (typeOverride !== undefined || keywordOverride !== undefined) {
      let newParams = {
        ...currentParams,
        ...(typeOverride !== null && { type: typeOverride }),
        ...(keywordOverride !== null && { keyword: keywordOverride }),
      };

      // If both overrides are null/empty, reset to no filter
      if (typeOverride === null && keywordOverride === "") {
        newParams = {
          page: currentParams.page || 1,
          limit: currentParams.limit || 10,
        };
      }

      // Update state to trigger refetch with new parameters
      setCurrentParams(newParams);
      setTriggerRefetch(prev => prev + 1);

      return newParams;
    } else {
      // Just refetch with current params
      return originalRefetch();
    }
  }, [currentParams, originalRefetch]);

  return {
    tasks: data?.data,
    isLoading,
    error,
    refetch,
  };
};


export const usePostAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => {
      return postAssignTask(payload);
    },
    onSuccess: (response, variables) => {
      // Invalidate task queries
      queryClient.invalidateQueries({ queryKey: ["task"] });

      // Invalidate submission monitoring queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["submissions-in-progress"] });
      queryClient.invalidateQueries({ queryKey: ["submissions-completed"] });
      queryClient.invalidateQueries({ queryKey: ["submissions-assigned"] });

      // Dispatch custom event for components that might listen to it
      window.dispatchEvent(new CustomEvent('refreshSubmissionMonitoring'));
    },
    onError: (error, variables) => {
      console.error("Error in hook:", error);
    },
  });
};

// export const usePatchSubmissionReview = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (SUBMISSION_ID) => patchSubmissionReview(SUBMISSION_ID),
//     onSuccess: (_, variables) => {
//       const submissionId = variables.SUBMISSION_ID;
//       queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
//     },
//   });
// };
export const usePostNewTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => postNewTask(payload),
    onSuccess: (response) => {
      console.log("ini response abis submis", response);
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
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

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ccNo) => deleteTask(ccNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
}
