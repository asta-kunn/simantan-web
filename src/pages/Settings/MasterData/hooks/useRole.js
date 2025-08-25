import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRole, postRole, putRole, deleteRole } from "@/services/role/role.service";

export const useGetRole = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["role"],
        queryFn: getRole,
    });

    return {
        data: data,
        isLoading,
        error,
        refetch
    }
}

export const usePostRole = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, refetch } = useMutation({
        mutationFn: postRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role"] });
        },
    });

    return {
        postRole: mutateAsync,
        isLoadingPostRole: isLoading,
        errorPostRole: error,
    }
}

export const usePutRole = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, refetch } = useMutation({
        mutationFn: putRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role"] });
        },
    });

    return {
        putRole: mutateAsync,
        isLoadingPutRole: isLoading,
        errorPutRole: error,
    }
}

export const useDeleteRole = (id) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, refetch } = useMutation({
        mutationFn: () => deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role"] });
        },
    });

    return {
        deleteRole: mutateAsync,
        isLoadingDeleteRole: isLoading,
        errorDeleteRole: error,
    }
}
