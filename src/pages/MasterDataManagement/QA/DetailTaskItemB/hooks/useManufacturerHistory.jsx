import { useMutation } from "@tanstack/react-query";
import { fetchHistoryManufacture } from "@/services/master-data-management/qa.service";

const useManufacturerHistory = (setHistoryChanges) => {
    const { mutate: mutateHistory } = useMutation({
        mutationFn: fetchHistoryManufacture,
        onSuccess: (data) => {
            setHistoryChanges([...data.data]);
        }
    });

    return { mutateHistory };
};

export default useManufacturerHistory;