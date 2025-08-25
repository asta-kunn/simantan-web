import { fetchContries } from "@/services/master-data-management/qa.service";
import { useQuery } from "@tanstack/react-query";


const useGetDataCountry = () => {
    const { data: dataCountry } = useQuery({
        queryKey: ['dataCountry'],
        queryFn: async () => {
            const response = await fetchContries();
            const modifyData = response.data.map(item => ({ value: item.COUNTRY_NAME, label: item.COUNTRY_NAME }));
            return modifyData
        }
    })


    return { dataCountry }
}

export default useGetDataCountry
