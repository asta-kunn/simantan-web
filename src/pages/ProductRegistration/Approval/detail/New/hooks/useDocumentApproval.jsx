import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putEditMarketingAuthorization } from "@/services/product-registration/new-product-registration/submission.service";

export const usePutEditMarketingAuthorization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => putEditMarketingAuthorization(payload),
    onSuccess: (_, variables) => {
      const submissionId = variables.SUBMISSION_ID;
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
    },
  });
};
