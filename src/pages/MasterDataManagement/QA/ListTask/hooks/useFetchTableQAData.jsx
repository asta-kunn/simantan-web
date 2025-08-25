import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTableTechnicalService } from '@/services/master-data-management/technical-service.service';


const useFetchTableQAData = () => {
    const [delayedPending, setDelayedPending] = useState(true);
    const [dataTable, setDataTable] = useState([]);
    const [filterValue, setFilterValue] = useState({
        manufacturing_site: [],
        finished_product: "",
        action_plan: [],
        status: [],
        registration_type: []
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total_page: 0,
        total_data: 0
    });
    const [tab, setTab] = useState("My Task")

    const { refetch, isFetching } = useQuery({
        queryKey: ['table-qa-data', filterValue, tab, pagination.page],
        queryFn: () => fetchTableTechnicalService({
            tab: tab,
            filters: {
                ...filterValue
            },
            pagination: {
                page: pagination.page,
                limit: 10,
            }
        }),
        onSuccess: (data) => {
            setDataTable(data?.data?.data || []);
        }
    });

    useEffect(() => {
        let timeout;

        if (isFetching) {
            setDelayedPending(true);
        } else {
            timeout = setTimeout(() => {
                setDelayedPending(false);
            }, 300);
        }
        return () => clearTimeout(timeout);
    }, [isFetching]);

    return {
        data: dataTable,
        isPending: delayedPending,
        originalIsPending: isFetching,
        refetch,
        setFilterValue,
        setPagination,
        setTab,
        tab,
        pagination,
        filterValue
    };
}

export default useFetchTableQAData
