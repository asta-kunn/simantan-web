import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles } from "@/services/master-data/role.service";

export const useGetRole = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  return { data, isLoading, error };
};
