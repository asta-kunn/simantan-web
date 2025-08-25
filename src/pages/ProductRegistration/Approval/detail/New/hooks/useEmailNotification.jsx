import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putSubmissionEmailNotification } from "@/services/product-registration/new-product-registration/submission.service";

export const usePutSubmissionEmailNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => putSubmissionEmailNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission"] });
    },
  });
};
