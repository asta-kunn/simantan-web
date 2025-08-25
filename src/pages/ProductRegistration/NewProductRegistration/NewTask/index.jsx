import { motion } from "framer-motion";
import { useState } from "react";
import { newRegTaskFilterMap } from "../constants/general";
import { usePostNewTask } from "../hooks/useNewRegTask";
import NewTaskContent from "./components/NewTaskContent";
import NewTaskFilter from "./components/NewTaskFilter";
import NewTaskHeader from "./components/NewTaskHeader";

const NewProductRegistrationNewTask = ({ 
  onChangeTab, 
  selectedFilter, 
  setSelectedFilter, 
  searchInput, 
  setSearchInput, 
  isLoading,
  unassignedTasks,
  onRefetch,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { postNewTask, isLoadingPostNewTask } = usePostNewTask();

  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
    setSearchInput("");
    setCurrentPage(1);
    setOpenFilter(false);
  };

  const handleSearch = () => {
    onRefetch(newRegTaskFilterMap[selectedFilter], searchInput);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="mx-auto p-6"
    >
      <NewTaskHeader
        onSubmitNewTask={postNewTask}
        isLoading={isLoadingPostNewTask}
        onRefetch={onRefetch}
      />
      <div className="flex flex-col bg-white border-tertiary-normal border rounded-md mt-3">
        <div className="p-4 space-y-4 border-b border-tertiary-normal">
          <NewTaskFilter
            openFilter={openFilter}
            onOpenFilter={setOpenFilter}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            searchInput={searchInput}
            onSearchInput={setSearchInput}
            onSearch={handleSearch}
          />
          <NewTaskContent
            isLoading={isLoading}
            data={unassignedTasks || []}
            currentPage={currentPage}
            onCurrentPage={setCurrentPage}
            onChangeTab={onChangeTab}
            onRefetch={onRefetch}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NewProductRegistrationNewTask;