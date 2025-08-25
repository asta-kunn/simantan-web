import { fetchActionPlan, fetchManufacturingSite } from '@/services/master-data-management/technical-service.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useDataFilterList = ({ filterValue, setFilterValue, tab }) => {
    const [filterListData, setFilterListData] = useState({
        manufacturing_site: [],
        action_plan: []
    })

    const { data: dataManufacure, isLoading: isLoadingManufacure, error: errorManufacure, refetch: refetchManufacure } = useQuery({
        queryKey: ['manufacturing-site'],
        queryFn: fetchManufacturingSite,
        onSuccess: (data) => {
            setFilterValue({
                ...filterValue,
                manufacturing_site: [...data.data]
            })
            setFilterListData({
                ...filterListData,
                manufacturing_site: [...data.data]
            })
        }
    });

    const { data: dataActionPlan, isLoading: isLoadingActionPlan, error: errorActionPlan, refetch: refetchActionPlan } = useQuery({
        queryKey: ['action-plan'],
        queryFn: fetchActionPlan,
        onSuccess: (data) => {
            setFilterListData({
                ...filterListData,
                action_plan: [...data.data]
            })
        }
    });

    useEffect(() => {
        if (dataManufacure && dataActionPlan) {
            setFilterValue({
                ...filterValue,
                finished_product: "",
                manufacturing_site: [...dataManufacure.data],
                action_plan: [...dataActionPlan.data],
            })
            setFilterListData({
                ...filterListData,
                manufacturing_site: [...dataManufacure.data],
                action_plan: [...dataActionPlan.data]
            })
        }
    }, [tab])

    return {
        dataManufacure,
        isLoadingManufacure,
        errorManufacure,
        refetchManufacure,
        dataActionPlan,
        isLoadingActionPlan,
        errorActionPlan,
        refetchActionPlan,
        filterListData,
        setFilterListData
    }
}

export default useDataFilterList
