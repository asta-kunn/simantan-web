import {
  getMonitoringSubmissions,
  getProjectTaskHistory,
  getSubmissionApprovalInformation,
  getSubmissionByID,
  getSubmissions,
  patchCancelProjectTask,
  patchCancelSubmission,
  patchConfirmAndSubmitSubmission,
  patchReassignSubmission
} from "@/services/product-registration/registration-variation-notification/subsmission.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetSubmissionAssigned = (roleCode) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submissions-assigned"],
    queryFn: () => getSubmissions({ roleCode }),
    enabled: !!roleCode,
  });

  return {
    data: data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetSubmissionDetail = (submissionId) => {
  const {
    data,
    isLoading: isLoadingSubmissionDetail,
    error: errorSubmissionDetail,
    refetch: refetchSubmissionDetail,
  } = useQuery({
    queryKey: ["submission-detail", submissionId],
    queryFn: () => getSubmissionByID(submissionId),
    enabled: !!submissionId,
  });

  return {
    submission: data,
    isLoadingSubmissionDetail,
    errorSubmissionDetail,
    refetchSubmissionDetail,
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

export const useGetInProgressSubmission = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submissions-in-progress"],
    queryFn: () => getMonitoringSubmissions({ status: "INPROGRESS" }),
  });

  return {
    inProgressSubmissions: data,
    isLoadingInProgressSubmission: isLoading,
    errorInProgressSubmission: error,
    refetchInProgressSubmission: refetch,
  };
};

export const useGetCompletedSubmission = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submissions-completed"],
    queryFn: () => getMonitoringSubmissions({ status: "COMPLETED" }),
  });

  return {
    completedSubmissions: data,
    isLoadingCompletedSubmission: isLoading,
    errorCompletedSubmission: error,
    refetchCompletedSubmission: refetch,
  };
};

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