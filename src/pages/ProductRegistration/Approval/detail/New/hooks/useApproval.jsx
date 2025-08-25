import {
  getSubmissionById,
  patchSubmissionReview,
  putSubmissionApproval
} from "@/services/product-registration/new-product-registration/submission.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useApprovalDetail = (submissionId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => {
      if (!submissionId) return null;
      return getSubmissionById(submissionId);
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
