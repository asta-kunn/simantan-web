import { useQuery } from '@tanstack/react-query'
import { fetchTableInactivationManufacturer } from '../services'
import { useEffect, useState } from 'react'

const useFetchDataTable = ({tabValue, filterForm}) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0
    });
    const [delayedPending, setDelayedPending] = useState(true);


    const goToNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const goToPreviousPage = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const goToFirstPage = () => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const goToLastPage = () => {
        setPagination((prev) => ({ ...prev, page: prev.totalPages }));
    };


    const { isError, refetch, isFetching } = useQuery({
        queryKey: ['table-inactivation-manufacturer', pagination, tabValue, filterForm],
        queryFn: () => fetchTableInactivationManufacturer({
            page: pagination.page,
            limit: pagination.limit,
            tab: tabValue,
            search_by: filterForm.search_by,
            search_value: filterForm.search_value
        }),
        onSuccess: (response) => {
            setData(response.data.data);
            setPagination(response.data.meta);
        }
    })

    useEffect(() => {
        let timeout;

        if (isFetching) {
            setDelayedPending(true);
        } else {
            timeout = setTimeout(() => {
                setDelayedPending(false);
            }, 100);
        }
        return () => clearTimeout(timeout);
    }, [isFetching]);

    return {
        data,
        fetchDataLoading: delayedPending,
        isError,
        refetch,
        pagination,
        setPagination,
        isFetching,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage
    }
}

export default useFetchDataTable
