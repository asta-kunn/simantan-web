import { useQuery } from '@tanstack/react-query'
import { fetchInactiveApproval } from '../services/index'
import { useState } from 'react';

const useFetchInactiveApproval = (detailId) => {
    const [data, setData] = useState(null);
    const { isFetching } = useQuery({
        queryKey: ['dataApproval', detailId],
        queryFn: () => fetchInactiveApproval(detailId),
        enabled: !!detailId,
        onSuccess: (response) => {
            setData(response.data)
        }
    })

    return { dataApproval: data, isFetching }
}

export default useFetchInactiveApproval
