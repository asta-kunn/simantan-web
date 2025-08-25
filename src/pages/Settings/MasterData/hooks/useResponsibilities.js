import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getResponsibilities, postResponsibilities, putResponsibilities, deleteResponsibilities } from "@/services/responsibilities/responsibilities.service";

export const useGetResponsibilities = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["responsibilities"],
        queryFn: getResponsibilities,
    });

    return {
        data: data,
        isLoading,
        error,
        refetch
    }
}

export const usePostResponsibilities = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset } = useMutation({
        mutationFn: postResponsibilities, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["responsibilities"] });
        },
    });

    return {
        postResponsibilities: mutateAsync,
        isLoadingPostResponsibilities: isLoading,
        errorPostResponsibilities: error,
        resetPostResponsibilities: reset
    }
}

export const usePutResponsibilities = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset } = useMutation({
        mutationFn: putResponsibilities,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["responsibilities"] });
        },
    });

    return {
        putResponsibilities: mutateAsync,
        isLoadingPutResponsibilities: isLoading,
        errorPutResponsibilities: error,
        resetPutResponsibilities: reset
    }
}

export const useDeleteResponsibilities = (id) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset } = useMutation({
        mutationFn: () => deleteResponsibilities(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["responsibilities"] });
        },
    });

    return {
        deleteResponsibilities: mutateAsync,
        isLoadingDeleteResponsibilities: isLoading,
        errorDeleteResponsibilities: error,
        resetDeleteResponsibilities: reset
    }
}


