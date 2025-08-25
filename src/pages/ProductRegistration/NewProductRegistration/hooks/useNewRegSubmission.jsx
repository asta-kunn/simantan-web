import { getProjectTaskHistory, getSubmissionApprovalInformation, getSubmissionById, getSubmissions, patchCancelProjectTask, patchCancelSubmission, patchConfirmAndSubmitSubmission, patchReassignSubmission } from "@/services/product-registration/new-product-registration/submission.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetSubmissions = (statusKey) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submissions", statusKey],
    queryFn: () => getSubmissions({ status: statusKey }),
    keepPreviousData: true,
    enabled: !!statusKey,
  });

  return {
    submissions: data,
    isLoadingSubmissions: isLoading,
    errorSubmissions: error,
    refetchSubmissions: refetch,
  };
};

export const useGetSubmissionById = (submissionId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submission-by-id", submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });

  return {
    submission: data,
    isLoadingSubmission: isLoading,
    errorSubmission: error,
    refetchSubmission: refetch,
  };
};

export const useGetProjectTaskHistory = (submissionId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["project-task-history", submissionId],
    queryFn: () => getProjectTaskHistory(submissionId),
    enabled: !!submissionId,
  });

  return {
    projectTaskHistory: data,
    isLoadingProjectTaskHistory: isLoading,
    errorProjectTaskHistory: error,
    refetchProjectTaskHistory: refetch,
  };
};

export const usePatchConfirmAndSubmitSubmission = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => patchConfirmAndSubmitSubmission(data),
  });

  return {
    confirmAndSubmitSubmission: mutateAsync,
    isLoadingConfirmAndSubmitSubmission: isLoading,
    errorConfirmAndSubmitSubmission: error,
    refetchConfirmAndSubmitSubmission: refetch,
  };
}

export const usePatchCancelSubmission = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => patchCancelSubmission(data),
  });

  return {
    cancelSubmission: mutateAsync,
    isLoadingCancelSubmission: isLoading,
    errorCancelSubmission: error,
    refetchCancelSubmission: refetch,
  };
}

export const usePatchCancelProjectTask = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => patchCancelProjectTask(data),
  });

  return {
    cancelProjectTask: mutateAsync,
    isLoadingCancelProjectTask: isLoading,
    errorCancelProjectTask: error,
    refetchCancelProjectTask: refetch,
  };
}

export const usePatchReassignSubmission = () => {
  const { mutateAsync, isLoading, error, refetch } = useMutation({
    mutationFn: (data) => patchReassignSubmission(data),
  });

  return {
    reassignSubmission: mutateAsync,
    isLoadingReassignSubmission: isLoading,
    errorReassignSubmission: error,
    refetchReassignSubmission: refetch,
  };
};

export const useGetSubmissionApprovalInformation = (submissionId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submission-approval-information", submissionId],
    queryFn: () => getSubmissionApprovalInformation(submissionId),
    enabled: !!submissionId,
  });

  return {
    approvalInformation: data,
    isLoadingApprovalInformation: isLoading,
    errorApprovalInformation: error,
    refetchApprovalInformation: refetch,
  };
};