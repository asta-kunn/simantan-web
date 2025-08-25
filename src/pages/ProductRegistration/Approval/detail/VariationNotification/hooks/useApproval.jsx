import {
  getOutstandingSubmissionApprovalHistory,
  getOutstandingSubmissionApprovalTasks,
  getSubmissionByID,
  patchSubmissionReview,
  putSubmissionApproval
} from "@/services/product-registration/registration-variation-notification/subsmission.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useApprovalTask = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["approvals-tasks"],
    queryFn: getOutstandingSubmissionApprovalTasks,
  });

  return { data, isLoading, error, refetch };
};

export const useApprovalHistory = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["approvals-history"],
    queryFn: getOutstandingSubmissionApprovalHistory,
  });

  return { data, isLoading, error, refetch };
};

export const useApprovalDetail = (submissionId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => {
      if (!submissionId) return null;
      return getSubmissionByID(submissionId);
    },
    enabled: !!submissionId,
  });

  return {
    submission: data,
    isLoading,
    error,
    refetch,
  };
};

export const usePatchSubmissionReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (SUBMISSION_ID) => patchSubmissionReview(SUBMISSION_ID),
    onSuccess: (_, variables) => {
      const submissionId = variables.SUBMISSION_ID;
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
    },
  });
};

export const usePutSubmissionApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => putSubmissionApproval(payload),
    onSuccess: (_, variables) => {
      const submissionId = variables.SUBMISSION_ID;
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
    },
  });
};
