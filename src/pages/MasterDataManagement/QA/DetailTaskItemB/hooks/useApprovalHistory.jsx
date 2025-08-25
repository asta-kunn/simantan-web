import { useQuery } from "@tanstack/react-query";
import { fetchApprovalHistoryQA } from "@/services/master-data-management/qa.service";

const useApprovalHistory = (detailId) => {
    const { data: dataApproval } = useQuery({
        queryKey: ['dataApproval'],
        queryFn: async () => {
            try {
                const response = await fetchApprovalHistoryQA({ detailId })

                if (!response) return [];

                return response.data
            } catch (error) {
                console.log(error, 'error')
                return [];
            }
        },
    });

    return { dataApproval };
};

export default useApprovalHistory;