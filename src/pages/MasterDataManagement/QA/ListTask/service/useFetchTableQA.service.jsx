import { useMutation } from '@tanstack/react-query'
import { fetchTableQA } from "@/services/master-data-management/qa.service";

export const useFetchTableQA = ({
    onSuccess,
    onError
}) => {
    const { mutate, isLoading, error, data } = useMutation({
        mutationFn: fetchTableQA,
        onSuccess: (data) => {
            onSuccess(data.data)
        },
        onError: (error) => {
            onError(error)
        }
    });

    return {
        mutate,
        isLoading,
        error,
        data
    }
}