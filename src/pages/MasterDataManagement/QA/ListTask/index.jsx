import { useNavigate } from "react-router-dom";
import techServiceStore from "@/stores/techServiceStore";
import authStore from "@/stores/authStore";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import { userRole } from "@/constants/role.constant";
import STATUS_APPROVAL from "../DetailTask/constants/qa-approval-status";
import useFetchTableQAData from "./hooks/useFetchTableQAData";
import useDataFilterList from "./hooks/useDataFilterList";
import useQAListHandlerFunction from "./hooks/useQAListHandlerFunction";
import QATableListPresenter from "./components/qa-table-list-presenter";

const QATableListContainer = () => {
  const navigate = useNavigate();
  const setDetailType = techServiceStore(state => state.setDetailType);
  const setDetailId = techServiceStore(state => state.setDetailId);
  const user = authStore(state => state.user);

  const {
    isPending,
    data,
    filterValue,
    setFilterValue,
    setPagination,
    tab,
    pagination,
    setTab
  } = useFetchTableQAData();

  const { filterListData } = useDataFilterList({
    filterValue,
    setFilterValue,
    tab
  });

  const {
    handleFilterValue,
    decrementPage,
    incrementPage,
    handleFirstPage,
    handleLastPage,
    handleDownloadExcel,
    handleDownloadPdf
  } = useQAListHandlerFunction({
    setFilterValue,
    filterValue,
    setPagination,
    pagination
  });

  const handleNavigate = (row) => {
    const role = user['ROLE_CODE'];
    const status = row.STATUS;

    const isEditable =
      (role === userRole.QA_MANAGER && status === STATUS_APPROVAL.WAITING_FOR_APPROVAL) ||
      (role === userRole.QA_OFFICER && status === STATUS_APPROVAL.SUBMITTED);

    setDetailType(isEditable ? EDITABLE_ENUM.Editable : EDITABLE_ENUM.NonEditable);
    setDetailId(row.FORMULA_ID);
    navigate("/master-data-management/approval-qa/detail");
  };


  return (
    <QATableListPresenter
      tab={tab}
      setTab={setTab}
      data={data}
      isPending={isPending}
      filterValue={filterValue}
      handleFilterValue={handleFilterValue}
      manufactureList={filterListData.manufacturing_site}
      actionPlanList={filterListData.action_plan}
      navigateToDetail={handleNavigate}
      pagination={pagination}
      previousPage={decrementPage}
      nextPage={incrementPage}
      handleFirstPage={handleFirstPage}
      handleLastPage={handleLastPage}
      downloadFile={tab !== "My Task" ? handleDownloadExcel : null}
      downloadFilePdf={tab !== "My Task" ? handleDownloadPdf : null}
    />
  );
};

export default QATableListContainer;
