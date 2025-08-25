import { useNavigate } from "react-router-dom";
import techServiceStore from "@/stores/techServiceStore";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import useFetchTableQAData from "../../QA/ListTask/hooks/useFetchTableQAData";
import useDataFilterList from "../../QA/ListTask/hooks/useDataFilterList";
import useQAListHandlerFunction from "../../QA/ListTask/hooks/useQAListHandlerFunction";
import QATableListPresenter from "../../QA/ListTask/components/qa-table-list-presenter";
import { STATUS_AVL } from "@/constants/status-task-avl";

const TechnicalServiceContainer = () => {
  const navigate = useNavigate();
  const setDetailType = techServiceStore(state => state.setDetailType);
  const setDetailId = techServiceStore(state => state.setDetailId);

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
    setDetailType(
      row.STATUS === STATUS_AVL.DRAFT || row.STATUS === STATUS_AVL.REJECT
        ? EDITABLE_ENUM.Editable
        : EDITABLE_ENUM.NonEditable
    );
    setDetailId(row.FORMULA_ID);
    navigate('/master-data-management/approve-vendor-list/detail');
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

export default TechnicalServiceContainer;
