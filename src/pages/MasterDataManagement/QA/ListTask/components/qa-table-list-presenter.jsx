import { motion } from "framer-motion";
import TabTechnicalService from "./TabTechnicalService";
import { TableScrollable } from "../../components/table-scroll";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const QATableListPresenter = ({
  tab,
  setTab,
  data,
  isPending,
  filterValue,
  handleFilterValue,
  manufactureList,
  actionPlanList,
  navigateToDetail,
  pagination,
  previousPage,
  nextPage,
  handleFirstPage,
  handleLastPage,
  downloadFile,
  downloadFilePdf
}) => {
  return (
    <div className="max-w-full mb-16">
      <div className="pb-2">
        <TabTechnicalService tab={tab} setTab={setTab} />
      </div>
      <div className="p-3">
        <motion.div
          key="table"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <TableScrollable
            data={data}
            filterValue={filterValue}
            setFilterValue={handleFilterValue}
            manufactureList={manufactureList}
            actionPlanList={actionPlanList}
            navigate={navigateToDetail}
            pagination={pagination}
            previousPage={previousPage}
            nextPage={nextPage}
            handleFirstPage={handleFirstPage}
            handleLastPage={handleLastPage}
            downloadFile={downloadFile}
            downloadFilePdf={downloadFilePdf}
            loading={isPending}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default QATableListPresenter;
