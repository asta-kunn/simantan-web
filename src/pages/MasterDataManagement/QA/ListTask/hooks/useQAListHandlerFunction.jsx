import { useMutation } from "@/hooks/use-mutation";
import { downloadReportByExcel, downloadReportByPdf } from "@/services/master-data-management/technical-service.service";

const useQAListHandlerFunction = ({ setFilterValue, filterValue, setPagination, pagination }) => {
    const downloadFileMutation = useMutation(downloadReportByExcel);
    const downloadFilePdfMutation = useMutation(downloadReportByPdf);

    const handleFilterValue = async (value) => {
        setFilterValue({ ...filterValue, ...value })
    }

    const decrementPage = () => {
        if (pagination.page === 1) return;
        setPagination(prev => ({ ...prev, page: prev.page - 1, total_page: prev.total_page }))
    }

    const incrementPage = () => {
        if (pagination.page === pagination.total_page) return;
        setPagination(prev => ({ ...prev, page: prev.page + 1, total_page: prev.total_page }))
    }

    const handleFirstPage = () => {
        setPagination(prev => ({ ...prev, page: 1, total_page: prev.total_page }))
    }

    const handleLastPage = () => {
        setPagination(prev => ({ ...prev, page: prev.total_page, total_page: prev.total_page }))
    }

    const handleDownloadExcel = async (id) => {
        await downloadFileMutation.mutate({ id })
    }

    const handleDownloadPdf = async (id) => {
        await downloadFilePdfMutation.mutate({ id })
    }

    return {
        handleFilterValue,
        decrementPage,
        incrementPage,
        handleFirstPage,
        handleLastPage,
        handleDownloadExcel,
        handleDownloadPdf
    }
}

export default useQAListHandlerFunction
