import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/services/auth.service";


export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => login(data),
  });
};
export const useSignup = () => {
  return useMutation({
    mutationFn: (data) => signup(data),
  });
};
