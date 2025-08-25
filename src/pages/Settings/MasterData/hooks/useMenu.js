import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenu, postMenu, putMenu, deleteMenu } from "@/services/menu/menu.service";

export const useGetMenu = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["menu"],
        queryFn: getMenu,
    });

    return {
        data: data,
        isLoading,
        error,
        refetch
    }
}

export const usePostMenu = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset } = useMutation({
        mutationFn: postMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu"] });
        },
    });

    return {
        postMenu: mutateAsync,
        isLoadingPostMenu: isLoading,
        errorPostMenu: error,
        resetPostMenu: reset
    }
}

export const usePutMenu = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset } = useMutation({
        mutationFn: putMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu"] });
        },
    });

    return {
        putMenu: mutateAsync,
        isLoadingPutMenu: isLoading,
        errorPutMenu: error,
        resetPutMenu: reset
    }
}

export const useDeleteMenu = (id) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading, error, reset, refetch } = useMutation({
        mutationFn: () => deleteMenu(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu"] });
        },
    });

    return {
        deleteMenu: mutateAsync,
        isLoadingDeleteMenu: isLoading,
        errorDeleteMenu: error,
        resetDeleteMenu: reset,
        refetchDeleteMenu: refetch
    }
}
