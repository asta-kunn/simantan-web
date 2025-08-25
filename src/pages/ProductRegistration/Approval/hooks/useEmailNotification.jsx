import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putSubmissionEmailNotification } from "@/services/product-registration/registration-variation-notification/subsmission.service";

export const useGetEmailTemplate = () => {
  return useQuery({
    queryKey: ["email-template"],
    queryFn: () => getEmailTemplate(), 
  });
};


export const usePutSubmissionEmailNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => putSubmissionEmailNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission"] });
    },
  });
};
