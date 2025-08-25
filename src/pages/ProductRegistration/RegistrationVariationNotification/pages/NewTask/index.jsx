import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

import { Button, Info, Badge, Input } from "@/components/Dexain";
import { Accordion } from "@/components/fields/Accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Info as IconInfo, Plus, Search, ChevronDown } from "lucide-react";

import { TablePagination } from "@/components/fields/Table/components/TablePagination";
import TableTask from "./components/TableTask";
import { ModalNewTask } from "./components/modals/ModalNewTask";
import { useUIStore } from "@/stores/uiStore";
import { useGetAllTasks } from "../../hooks/useTask";

const NewTask = ({ onDataCountChange, onSwitchTab }) => {
  const [selectedFilter, setSelectedFilter] = useState("Finished Product");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const { addStack, closeStack } = useUIStore();
  const [accordionWithSelection, setAccordionWithSelection] = useState(null);
  const [accordionSelections, setAccordionSelections] = useState({});
  
  // New accordion state management using global API
  const [accordionValue, setAccordionValue] = useState(""); // For single mode
  const [tablePaginationStates, setTablePaginationStates] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Map frontend filter names to API filter types
  const getFilterType = (filterName) => {
    const filterMap = {
      "Finished Product": "finished_product_description",
      "Marketing Authorization Holder": "marketing_author_holder",
      "Manufacturing Site": "manufacturing_site",
      Country: "country",
      "Change Control No": "cc_no",
    };
    return filterMap[filterName];
  };

  // Use mutations for API calls
  const { tasks, isLoading, refetch } = useGetAllTasks({
    page: currentPage,
    limit: 10,
    keyword: searchInput,
    type: getFilterType(selectedFilter),
  });

  // Helper function to create consistent accordion ID based on unique combination of fields
  const createAccordionId = (data) => {
    return `${data.FINISHED_PRODUCT_DESCRIPTION || ""}_${data.NIE_MA_HOLDER || ""}_${data.MANUFACTURING_SITE || ""}_${data.COUNTRY || ""}`;
  };

  // Use tasks directly from API (no client-side filtering)
  const accordionData = Array.isArray(tasks) ? tasks : [];

  // Fetch tasks on component mount
  useEffect(() => {
    refetch();
  }, []);

  // Calculate and notify parent component about total change controls count
  const countRef = useRef(0);
  useEffect(() => {
    if (onDataCountChange) {
      const totalChangeControls = accordionData.reduce((total, data) => {
        return (
          total +
          (data.CHANGE_CONTROLS?.length || data.totalChangeControls || 0)
        );
      }, 0);
      
      // Only call if count actually changed
      if (countRef.current !== totalChangeControls) {
        countRef.current = totalChangeControls;
        onDataCountChange(totalChangeControls);
      }
    }
  }, [accordionData]); // Removed onDataCountChange from dependencies

  // Preserve accordion selection - only reset if accordion completely disappears from data
  useEffect(() => {
    if (accordionWithSelection) {
      // Check if the accordion still exists in the data using stable identifier
      const accordionStillExists = accordionData.some((data) => {
        const accordionId = createAccordionId(data);
        return accordionId === accordionWithSelection;
      });

      // Only reset if the accordion completely disappears from the dataset
      if (!accordionStillExists) {
        setAccordionWithSelection(null);
        // Also clear the selections for this accordion
        setAccordionSelections((prev) => {
          const newSelections = { ...prev };
          delete newSelections[accordionWithSelection];
          return newSelections;
        });
        // Clear accordion value if it matches the missing accordion
        if (accordionValue === accordionWithSelection) {
          setAccordionValue("");
        }
      }
    }
  }, [accordionData, accordionWithSelection, accordionValue]);

  // Pagination for accordion items (use API response directly)
  const pageSize = 10;
  const totalPages = Math.ceil(accordionData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, accordionData.length);
  const currentPageData = accordionData.slice(startIndex, endIndex);

  // Pagination handlers
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleSave = async (values) => {
    await refetch();
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const executeSearch = () => {
    const filterType = getFilterType(selectedFilter);
    const keyword = searchInput.trim();
    setCurrentPage(1);
    setTablePaginationStates({});
    refetch(filterType, keyword);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  const handleFilterChange = (newFilter) => {
    const hasActiveFilter = searchInput.trim() !== "";
    setSelectedFilter(newFilter);
    setSearchInput("");
    setCurrentPage(1);
    setAccordionWithSelection(null);
    setAccordionSelections({});
    setAccordionValue(""); // Reset accordion value
    setTablePaginationStates({}); // Reset table pagination states
    // Only refetch if there was a previous active filter that needs to be reset
    if (hasActiveFilter) {
      refetch(null, ""); // Pass null filter type and empty keyword to reset
    }
  };

  // New accordion value change handler
  const handleAccordionValueChange = useCallback((newValue) => {
    setAccordionValue(newValue);
  }, []);

  const handleTablePaginationChange = useCallback((accordionId, paginationState) => {
    setTablePaginationStates((prev) => {
      // Only update if the state actually changed
      const currentState = prev[accordionId];
      if (!currentState || currentState.currentPage !== paginationState.currentPage) {
        return {
          ...prev,
          [accordionId]: paginationState,
        };
      }
      return prev;
    });
  }, []);

  const handleSelectionChange = useCallback(
    (accordionId, hasSelection, selectedIds = []) => {
      // isi fungsi sama persis
      setAccordionSelections((prev) => ({
        ...prev,
        [accordionId]: selectedIds,
      }));
      if (hasSelection) {
        setAccordionWithSelection(accordionId);
      } else if (accordionWithSelection === accordionId) {
        setAccordionWithSelection(null);
      }
    },
    [accordionWithSelection]
  );

  const handleAssignTask = async (selectedChangeControls, taskSetup) => {
    await refetch();
  };

  const openNewSubmissionModal = () => {
    // using addStack
    addStack({
      type: "modal",
      title: "Add New Task",
      size: "3xl",
      content: (
        <ModalNewTask
          open={true}
          onOpenChange={closeStack}
          onSave={handleSave}
          onRefetch={refetch}
        />
      ),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="mx-auto p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Info
            label="Registration Submission Requests"
            labelClassName="font-bold text-black text-xl"
            value={
              <div className="flex items-center gap-1 text-info-normal font-weight-400 text-sm">
                <IconInfo className="w-3 h-3" />
                You can assign multiple CC for 1 product from 1 NIE/MA Holder &
                MFG Site.
              </div>
            }
          />
          <Button onClick={openNewSubmissionModal}>
            <Plus className="w-3 h-3" /> New Tasks
          </Button>
        </div>
      </div>
      <div className="flex flex-col bg-white border-tertiary-normal border rounded-md mt-3">
        {/* Filter and Search Section */}
        <div className="p-4 border-b border-tertiary-normal">
          <div className="flex items-center border bg-system-input border-system-divider rounded-md overflow-hidden">
            {/* Filter by label */}
            <div className="bg-info-soft text-info-normal text-sm font-semibold px-3 py-4 border-r border-gray-300 whitespace-nowrap">
              Filter by :
            </div>
            {/* Filter Dropdown */}
            <Popover open={openFilter} onOpenChange={setOpenFilter}>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 focus:outline-none min-w-[200px] justify-between border-r border-gray-300"
                  type="button"
                >
                  {selectedFilter}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[200px]">
                <div className="flex flex-col">
                  {[
                    "Finished Product",
                    "Marketing Authorization Holder",
                    "Manufacturing Site",
                    "Country",
                    "Change Control No",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange(item);
                        setOpenFilter(false);
                      }}
                      className={`text-sm text-left px-4 py-2 hover:bg-gray-100 transition-all duration-300 ${
                        selectedFilter === item ? "text-primary-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {/* Search Input */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder={`Search ${selectedFilter}...`}
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyPress}
                className="border-0 rounded-none shadow-none focus:border-none bg-transparent"
              />
            </div>
            {/* Search Button */}
            <Button
              onClick={executeSearch}
              className="bg-primary-normal hover:bg-primary-dark text-white px-3 py-2 border-radius-2 border-0 border-l border-primary-normal mx-1"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Content Section */}
        <div className="flex-1 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              {/* ganti dengan spinner/skeleton yang Anda pakai di project */}
            </div>
          ) : (
            <div className="w-100">
              {currentPageData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <span className="text-neutral-gray text-lg">
                    No results Data
                  </span>
                </div>
              )}
              {currentPageData.map((data, i) => {
                const handleProductClick = (e) => {
                  e.stopPropagation();
                  // Enable this when we have running project sheet
                  // openRunningProjectSheet(data);
                };
                // Use stable identifier based on combination of key fields that define unique accordion
                const accordionId = createAccordionId(data);
                const isDisabled =
                  accordionWithSelection !== null &&
                  accordionWithSelection !== accordionId;
                return (
                  <Accordion
                    key={accordionId}
                    type="multiple"
                    value={accordionValue}
                    onValueChange={handleAccordionValueChange}
                    accordionId={accordionId}
                    openItemClassName="border-primary-normal rounded-t-md"
                    openHeaderClassName= "bg-primary-soft rounded-t-md"
                    title={
                      <div className="flex flex-col space-y-2 w-full">
                        <div className="flex flex-row items-center w-full">
                          <span
                            className="text-sm text-primary-normal cursor-pointer hover:underline"
                            onClick={handleProductClick}
                          >
                            {data.FINISHED_PRODUCT_DESCRIPTION}
                          </span>
                          <Badge
                            color="primary"
                            variant="filled"
                            size="sm"
                            className="bg-secondary-normal text-white px-2.5 py-0.5 ml-3"
                          >
                            {data.CHANGE_CONTROLS?.length ||
                              data.totalChangeControls ||
                              0}{" "}
                            Change control(s)
                          </Badge>
                        </div>
                        <div className="flex flex-row gap-4 w-3/4 ml-[-10px]">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className="text-neutral-gray text-xs font-medium px-2.5 py-0.5 rounded-full">
                              MA Holder
                            </span>
                            <span className="text-sm">
                              {data.NIE_MA_HOLDER}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 w-1/3">
                            <span className="text-neutral-gray text-xs font-medium px-2.5 py-0.5 rounded-full">
                              MFG Site
                            </span>
                            <span className="text-sm">
                              {data.MANUFACTURING_SITE}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 w-1/3">
                            <span className="text-neutral-gray text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Country
                            </span>
                            <span className="text-sm">{data.COUNTRY}</span>
                          </div>
                        </div>
                      </div>
                    }
                    separator={true}
                  >
                    <TableTask
                      changeControls={data.CHANGE_CONTROLS}
                      onAssign={handleAssignTask}
                      onSelectionChange={handleSelectionChange.bind(
                        null,
                        accordionId
                      )}
                      disabled={isDisabled}
                      onRefetch={refetch}
                      persistedSelection={
                        accordionSelections[accordionId] || []
                      }
                      accordionId={accordionId}
                      onSwitchTab={onSwitchTab}
                      productInfo={{
                        FINISHED_PRODUCT_ID: data.FINISHED_PRODUCT_ID,
                        FINISHED_PRODUCT_CODE: data.FINISHED_PRODUCT_CODE,
                        FINISHED_PRODUCT_NAME: data.FINISHED_PRODUCT_NAME,
                        FINISHED_PRODUCT_DESCRIPTION:
                          data.FINISHED_PRODUCT_DESCRIPTION,
                        NIE_MA_HOLDER: data.NIE_MA_HOLDER,
                        MANUFACTURING_SITE: data.MANUFACTURING_SITE,
                        COUNTRY: data.COUNTRY,
                      }}
                      // Pass table pagination state and handler
                      tablePaginationState={tablePaginationStates[accordionId]}
                      onTablePaginationChange={(paginationState) => 
                        handleTablePaginationChange(accordionId, paginationState)
                      }
                    />
                  </Accordion>
                );
              })}
            </div>
          )}
        </div>
        {/* Pagination Footer */}
        <div className="border-t-2 border-tertiary-normal">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            filteredData={accordionData}
            handleFirstPage={handleFirstPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handleLastPage={handleLastPage}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NewTask;
