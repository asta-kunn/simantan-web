import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchApprovalHistory } from '../services'    
  
const useFetchApprovalHistory = ({ requestId }) => {
    const [dataApproval, setDataApproval] = useState([])
    const {  isLoading, error } = useQuery({
        queryKey: ['approval-history'],
        queryFn: () => fetchApprovalHistory(requestId),
        onSuccess: (data) => {
            setDataApproval(data.data)
        }
    })

    return {
        dataApproval,
        isLoading,
        error
    }
}

export default useFetchApprovalHistory
