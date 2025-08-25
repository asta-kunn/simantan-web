import { useEffect, useState } from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { downloadReportByExcel, downloadReportByPdf } from "@/services/master-data-management/technical-service.service";
import { Tabs } from "@/components/Dexain";
import { TableItemSubstitusi } from "../components/table-data-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiGetListTaskItem } from "@/services/master-data-management/item-substitusi.service";
import { useQuery } from "@tanstack/react-query";
import ItemSubstitutionListSkeleton from "./components/item-substitution-list-skeleton";
import techServiceStore from "@/stores/techServiceStore";


const TechnicalService = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    tab: 'In Progress'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_page: 0,
    total_data: 0
  });
  const [filterListData, setFilterListData] = useState({
    manufacturing_site: [],
    action_plan: []
  })


  const setDetailSubstitutionItem = techServiceStore(state => state.setDetailSubstitutionItem);

  const downloadFileMutation = useMutation(downloadReportByExcel);
  const downloadFilePdfMutation = useMutation(downloadReportByPdf);

  const { refetch, data: dataListTaskItem } = useQuery({
    queryKey: ['dataListTaskItem'],
    queryFn: () => apiGetListTaskItem(filterValue)
  })

  useEffect(() => {
    refetch()
  }, [filterValue])

  const handleFilterValue = async () => {
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

  if (!dataListTaskItem) return <ItemSubstitutionListSkeleton />

  return (
    <motion.div
      className="max-w-full mb-16 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-row justify-between gap-2 items-center mb-4">
        <div className="flex flex-col ">
          <p className="text-2xl font-bold">Substitution Item</p>
          <p className="text-sm text-gray-500">
            List of substitution item requests for a Finished Product
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            className="flex flex-row gap-2"
            onClick={() => {
              navigate("/master-data-management/item-substitution/create");
            }}
          >
            <Plus className="w-4 h-4" />
            <p className="text-sm font-medium">New Request</p>
          </Button>
        </div>
      </div>

      <div className="pb-2">
        <Tabs
          style="pill"
          value={filterValue.tab}
          onValueChange={(value) => {
            setFilterValue({ ...filterValue, tab: value });
          }}
          tabs={[
            {
              value: "In Progress",
              label: "In Progress",
              content: (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableItemSubstitusi
                    data={dataListTaskItem?.data}
                    filterValue={filterValue}
                    setFilterValue={(value) => {
                      handleFilterValue(value);
                    }}
                    manufactureList={filterListData.manufacturing_site}
                    actionPlanList={filterListData.action_plan}
                    tab="In Progress"
                    pagination={pagination}
                    previousPage={decrementPage}
                    nextPage={incrementPage}
                    handleFirstPage={handleFirstPage}
                    handleLastPage={handleLastPage}
                    onView={(requestId) => {
                      setDetailSubstitutionItem(requestId);
                      navigate("/master-data-management/item-substitution/edit");
                    }}
                  />
                </motion.div>
              ),
            },
            {
              value: "Completed",
              label: "Completed",
              content: (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableItemSubstitusi
                    data={dataListTaskItem?.data}
                    filterValue={filterValue}
                    setFilterValue={(value) => {
                      handleFilterValue(value);
                    }}
                    manufactureList={filterListData.manufacturing_site}
                    actionPlanList={filterListData.action_plan}
                    tab="Completed"
                    pagination={pagination}
                    previousPage={decrementPage}
                    nextPage={incrementPage}
                    handleFirstPage={handleFirstPage}
                    handleLastPage={handleLastPage}
                    onView={(requestId) => {
                      setDetailSubstitutionItem(requestId);
                      navigate("/master-data-management/item-substitution/detail");
                    }}
                  />
                </motion.div>
              ),
            },
          ]}
        />
      </div>
    </motion.div>
  );
};

export default TechnicalService;