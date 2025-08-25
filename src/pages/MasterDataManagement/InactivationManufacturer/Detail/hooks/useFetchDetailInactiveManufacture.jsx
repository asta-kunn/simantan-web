import { useQuery } from '@tanstack/react-query'
import { findDetailInactiveManufacture } from '../services'
import { useState } from 'react'

const useFetchDetailInactiveManufacture = (id) => {
    const [detailItemA, setdetailItemA] = useState(null);   
    const {isLoading, isError} = useQuery({
        queryKey: ['detail-inactive-manufacture', id],
        queryFn: () => findDetailInactiveManufacture(id),
        onSuccess: (response) => {
            setdetailItemA({...response.data});
        }
    })

    return {
        data: detailItemA,
        isLoading,
        isError
    }
}

export default useFetchDetailInactiveManufacture
