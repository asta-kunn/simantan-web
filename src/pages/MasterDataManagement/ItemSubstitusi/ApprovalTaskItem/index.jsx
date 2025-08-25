import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { TableItemSubstitusi } from "../components/table-data-list"
import { apiGetApprovalTaskItem,  } from "@/services/master-data-management/item-substitusi.service";
import { useQuery } from "@tanstack/react-query";
import ItemSubstitutionListSkeleton from "./components/item-substitution-list-skeleton";
import TabApprovalList from "./components/tab-approval-list";
import techServiceStore from "@/stores/techServiceStore";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ApprovalListTaskItem = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    tab: 'Approval Task'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_page: 0,
    total_data: 0
  });

  
  const setDetailSubstitutionItem = techServiceStore(state => state.setDetailSubstitutionItem);

  const { refetch, data: listApproval } = useQuery({
    queryKey: ['listApproval'],
    queryFn: () => apiGetApprovalTaskItem(filterValue)
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

  if (!listApproval) return <ItemSubstitutionListSkeleton />

  return (
    <>
      <TabApprovalList tab={filterValue.tab} setTab={(value) => {
        setFilterValue({ ...filterValue, tab: value })
      }} />
      <div className="max-w-full mb-16 p-4">

        <div className="flex flex-row justify-between gap-2 items-center mb-4">
          <div className="flex flex-col ">
            <p className="text-lg font-bold">Substitution Item Approval</p>
            <p className="text-sm text-gray-500">List of substitution item requests for a Finished Product</p>
          </div>
        </div>

        <motion.div
          key="other-task"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <TableItemSubstitusi
            data={listApproval?.data}
            filterValue={filterValue}
            setFilterValue={(value) => { handleFilterValue(value) }}
            navigate={navigate}
            pagination={pagination}
            previousPage={decrementPage}
            nextPage={incrementPage}
            handleFirstPage={handleFirstPage}
            handleLastPage={handleLastPage}
            onView={(requestId) => {
              setDetailSubstitutionItem(requestId)
              navigate("/master-data-management/item-substitution/detail")
            }}
          />
        </motion.div>
      </div>
    </>

  );
};

export default ApprovalListTaskItem;