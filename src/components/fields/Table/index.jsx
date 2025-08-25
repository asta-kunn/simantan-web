import React, { useState, memo, useMemo, useCallback } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table as ShadcnTable } from "@/components/ui/table";
import { Checkbox } from "@/components/Dexain";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { TablePagination } from "./components/TablePagination";
import { TableFilter } from "./components/TableFilter";
import { TableActions } from "./components/TableActions";
import dayjs from "dayjs";

import { ArrowDownUp, ArrowDownAZ, ArrowUpZA } from "lucide-react";

import { createTestIdProps } from "@/lib/utils";

/**
 * Enhanced Table Component with comprehensive features
 *
 * @example
 * // Basic usage
 * <Table
 *   data={data}
 *   columns={columns}
 *   pagination={true}
 * />
 *
 * @example
 * // With custom selection and banner
 * <Table
 *   data={data}
 *   columns={columns}
 *   selectedIds={selectedIds}
 *   onSelectionChange={handleSelectionChange}
 *   allSelected={allSelected}
 *   onSelectAllChange={handleSelectAllChange}
 *   getItemId={getItemId}
 *   enableSelectionBanner={true}
 *   selectionBannerContent={<BannerContent />}
 * />
 *
 * @example
 * // With loading and empty states
 * <Table
 *   data={data}
 *   columns={columns}
 *   isLoading={loading}
 *   emptyStateMessage="No data found"
 * />
 *
 * @example
 * // With actions
 * <Table
 *   data={data}
 *   columns={columns}
 *   actions={[
 *     { icon: <Edit />, label: "Edit", onClick: (row) => edit(row) },
 *     { icon: <Delete />, label: "Delete", onClick: (row) => delete(row) }
 *   ]}
 * />
 */
export const Table = memo(
  ({
    columns = [],
    data = [],
    actions = [],
    pagination = true,
    pageSize = 10,
    onRowClick,
    onRowCheck,
    actionType = "button",
    actionVariant = "button",
    getCaption,
    // Selection props (custom pattern)
    enableSelectionBanner = false,
    selectionBannerContent = null,
    selectedIds = [],
    onSelectionChange,
    allSelected = false,
    onSelectAllChange,
    getItemId,
    // Loading & Empty States
    isLoading = false,
    emptyStateMessage = "No results.",
    // Basic styling
    disabled = false,
    maxHeight = null,
    // Control
    hideHeader = false,
    hidePagination = false,
    ...rest
  }) => {
    const [columnFilters, setColumnFilters] = useState({});
    const [openFilter, setOpenFilter] = useState(null);
    const [openPopoverIds, setOpenPopoverIds] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [customSorting, setCustomSorting] = useState({});

    // Extract filter configurations from column definitions
    const filterableColumns = useMemo(() => {
      return columns
        .filter((col) => col.filter)
        .map((col) => ({
          id: col.accessorKey,
          type: col.filter,
          options: col.option || [],
        }));
    }, [columns]);

    // Check if filtering is enabled
    const isFilteringEnabled = filterableColumns.length > 0;

    // Data with row numbers
    const dataWithRowNumbers = useMemo(() => {
      return data.map((item, index) => ({
        ...item,
        __rowNumber: index + 1,
        __isDisabled: disabled,
      }));
    }, [data, disabled]);

    // Apply filters and sorting
    const filteredAndSortedData = useMemo(() => {
      let filtered = [...dataWithRowNumbers];

      // Apply column filters
      if (isFilteringEnabled) {
        Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
          const filterConfig = filterableColumns.find((f) => f.id === columnId);
          if (!filterConfig) return;

          // Skip empty filters based on filter type
          const isEmpty = () => {
            if (filterValue === undefined || filterValue === null) return true;
            if (
              filterConfig.type === "select" ||
              filterConfig.type === "checkbox"
            ) {
              return Array.isArray(filterValue)
                ? filterValue.length === 0
                : false;
            }
            return filterValue === "";
          };

          if (isEmpty()) {
            return; // Skip empty filters
          }

          filtered = filtered.filter((row) => {
            const cellValue = row[columnId];

            // Helper function untuk mencari dalam nested object/array
            const searchInNestedData = (data, searchTerm) => {
              if (data === null || data === undefined) return false;

              // Jika data adalah string atau number, cek langsung
              if (typeof data === "string" || typeof data === "number") {
                return String(data)
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              }

              // Jika data adalah array
              if (Array.isArray(data)) {
                return data.some((item) =>
                  searchInNestedData(item, searchTerm)
                );
              }

              // Jika data adalah object
              if (typeof data === "object") {
                return Object.values(data).some((value) =>
                  searchInNestedData(value, searchTerm)
                );
              }

              return false;
            };

            // Helper function untuk mencari value dalam nested object/array untuk select/checkbox
            const findValueInNestedData = (data, targetValue) => {
              if (data === null || data === undefined) return false;

              // Jika data sama dengan target value
              if (data === targetValue) return true;

              // Jika data adalah array
              if (Array.isArray(data)) {
                return data.some((item) =>
                  findValueInNestedData(item, targetValue)
                );
              }

              // Jika data adalah object
              if (typeof data === "object") {
                return Object.values(data).some((value) =>
                  findValueInNestedData(value, targetValue)
                );
              }

              return false;
            };

            // Handle different filter types
            switch (filterConfig.type) {
              case "text":
                if (!cellValue) return false;

                // Jika cellValue adalah string biasa
                if (typeof cellValue === "string") {
                  return cellValue
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase());
                }

                // Jika cellValue adalah object atau array, cari di dalamnya
                return searchInNestedData(cellValue, String(filterValue));

              case "select":
                // Untuk select, cari apakah ada value yang cocok dalam nested data
                if (Array.isArray(filterValue)) {
                  return filterValue.some((val) =>
                    findValueInNestedData(cellValue, val)
                  );
                }
                return findValueInNestedData(cellValue, filterValue);

              case "checkbox":
                if (!Array.isArray(filterValue) || filterValue.length === 0)
                  return true;

                // Cari apakah ada value yang cocok dalam nested data
                return filterValue.some((val) =>
                  findValueInNestedData(cellValue, val)
                );

              case "date":
                if (!cellValue || !filterValue) return false;

                // Helper untuk extract date dari nested object
                const extractDate = (data) => {
                  if (data instanceof Date) return data;
                  if (typeof data === "string" && !isNaN(Date.parse(data)))
                    return new Date(data);
                  if (Array.isArray(data)) {
                    for (let item of data) {
                      const date = extractDate(item);
                      if (date) return date;
                    }
                  }
                  if (typeof data === "object" && data !== null) {
                    for (let value of Object.values(data)) {
                      const date = extractDate(value);
                      if (date) return date;
                    }
                  }
                  return null;
                };

                const rowDate = extractDate(cellValue);
                const filterDate =
                  filterValue instanceof Date
                    ? filterValue
                    : new Date(filterValue);

                return rowDate
                  ? rowDate.toDateString() === filterDate.toDateString()
                  : false;

              case "datetime":
                if (!cellValue || !filterValue) return false;

                // Helper untuk extract datetime dari nested object
                const extractDateTime = (data) => {
                  if (data instanceof Date) return data;
                  if (typeof data === "string" && !isNaN(Date.parse(data)))
                    return new Date(data);
                  if (Array.isArray(data)) {
                    for (let item of data) {
                      const datetime = extractDateTime(item);
                      if (datetime) return datetime;
                    }
                  }
                  if (typeof data === "object" && data !== null) {
                    for (let value of Object.values(data)) {
                      const datetime = extractDateTime(value);
                      if (datetime) return datetime;
                    }
                  }
                  return null;
                };

                const rowDateTime = extractDateTime(cellValue);
                const filterDateTime =
                  filterValue instanceof Date
                    ? filterValue
                    : new Date(filterValue);

                return rowDateTime
                  ? rowDateTime.getTime() === filterDateTime.getTime()
                  : false;

              case "number":
                // Helper untuk extract number dari nested object
                const extractNumber = (data) => {
                  if (typeof data === "number") return data;
                  if (typeof data === "string" && !isNaN(Number(data)))
                    return Number(data);
                  if (Array.isArray(data)) {
                    for (let item of data) {
                      const num = extractNumber(item);
                      if (num !== null) return num;
                    }
                  }
                  if (typeof data === "object" && data !== null) {
                    for (let value of Object.values(data)) {
                      const num = extractNumber(value);
                      if (num !== null) return num;
                    }
                  }
                  return null;
                };

                const rowNumber = extractNumber(cellValue);
                return rowNumber === Number(filterValue);

              default:
                return findValueInNestedData(cellValue, filterValue);
            }
          });
        });
      }

      // Apply global search filter (enhanced untuk nested objects)
      if (globalFilter) {
        const searchTerm = globalFilter.toLowerCase();
        filtered = filtered.filter((row) => {
          return Object.keys(row).some((key) => {
            if (key === "__rowNumber") return false;
            const value = row[key];

            // Helper function untuk global search dalam nested data
            const globalSearchInNestedData = (data) => {
              if (data === null || data === undefined) return false;

              // Jika data adalah string atau number, cek langsung
              if (typeof data === "string" || typeof data === "number") {
                return String(data).toLowerCase().includes(searchTerm);
              }

              // Jika data adalah array
              if (Array.isArray(data)) {
                return data.some((item) => globalSearchInNestedData(item));
              }

              // Jika data adalah object
              if (typeof data === "object") {
                return Object.values(data).some((val) =>
                  globalSearchInNestedData(val)
                );
              }

              return false;
            };

            return globalSearchInNestedData(value);
          });
        });
      }

      // Apply custom sorting
      const activeSorts = Object.entries(customSorting).filter(
        ([_, sortDirection]) => sortDirection && sortDirection !== "normal"
      );

      if (activeSorts.length > 0) {
        const [columnId, sortDirection] = activeSorts[activeSorts.length - 1];

        filtered.sort((a, b) => {
          const aValue = a[columnId];
          const bValue = b[columnId];

          // Handle null/undefined values
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return sortDirection === "asc" ? 1 : -1;
          if (bValue == null) return sortDirection === "asc" ? -1 : 1;

          // Helper untuk extract sortable value dari nested object/array
          const extractSortableValue = (data) => {
            if (data === null || data === undefined) return null;

            // Jika data adalah primitive, return langsung
            if (
              typeof data === "string" ||
              typeof data === "number" ||
              data instanceof Date
            ) {
              return data;
            }

            // Jika data adalah array, ambil elemen pertama yang bisa di-sort
            if (Array.isArray(data)) {
              for (let item of data) {
                const sortableValue = extractSortableValue(item);
                if (sortableValue !== null) return sortableValue;
              }
            }

            // Jika data adalah object, ambil value pertama yang bisa di-sort
            if (typeof data === "object") {
              for (let value of Object.values(data)) {
                const sortableValue = extractSortableValue(value);
                if (sortableValue !== null) return sortableValue;
              }
            }

            return null;
          };

          const sortableA = extractSortableValue(aValue);
          const sortableB = extractSortableValue(bValue);

          // Handle null/undefined sortable values
          if (sortableA == null && sortableB == null) return 0;
          if (sortableA == null) return sortDirection === "asc" ? 1 : -1;
          if (sortableB == null) return sortDirection === "asc" ? -1 : 1;

          // Handle different data types
          let comparison = 0;

          // Date comparison
          if (sortableA instanceof Date && sortableB instanceof Date) {
            comparison = sortableA.getTime() - sortableB.getTime();
          }
          // String date comparison
          else if (
            typeof sortableA === "string" &&
            typeof sortableB === "string" &&
            !isNaN(Date.parse(sortableA)) &&
            !isNaN(Date.parse(sortableB))
          ) {
            const dateA = new Date(sortableA);
            const dateB = new Date(sortableB);
            comparison = dateA.getTime() - dateB.getTime();
          }
          // Number comparison
          else if (
            typeof sortableA === "number" &&
            typeof sortableB === "number"
          ) {
            comparison = sortableA - sortableB;
          }
          // String comparison
          else {
            const strA = String(sortableA).toLowerCase();
            const strB = String(sortableB).toLowerCase();
            comparison = strA.localeCompare(strB);
          }

          return sortDirection === "asc" ? comparison : -comparison;
        });
      }

      return filtered;
    }, [
      dataWithRowNumbers,
      isFilteringEnabled,
      columnFilters,
      globalFilter,
      filterableColumns,
      customSorting,
    ]);

    const handleActionClick = useCallback((action, rowData, rowId) => {
      if (typeof action.onClick === "function") {
        action.onClick(rowData);
      }
      setOpenPopoverIds((prev) => ({
        ...prev,
        [rowId]: false,
      }));
    }, []);

    const applyFilter = useCallback((columnId, value) => {
      setColumnFilters((prev) => {
        const newFilters = { ...prev };

        // If filterValue is undefined, null, empty string, or empty array, remove the filter
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete newFilters[columnId];
        } else {
          newFilters[columnId] = value;
        }

        return newFilters;
      });

      // Close filter popover after applying
      setOpenFilter(null);
    }, []);

    const resetFilter = useCallback(
      (columnId) => {
        if (!isFilteringEnabled) return;

        const filterConfig = filterableColumns.find((f) => f.id === columnId);
        if (!filterConfig) return;

        // Remove from column filters
        setColumnFilters((prev) => {
          const newFilters = { ...prev };
          delete newFilters[columnId];
          return newFilters;
        });
      },
      [isFilteringEnabled, filterableColumns]
    );

    // Custom sort handler for three-state sorting
    const handleCustomSort = useCallback((columnId) => {
      setCustomSorting((prev) => {
        const currentSort = prev[columnId];
        let newSort;

        // Cycle through: normal -> asc -> desc -> normal
        if (!currentSort || currentSort === "normal") {
          newSort = "asc";
        } else if (currentSort === "asc") {
          newSort = "desc";
        } else {
          newSort = "normal";
        }

        // melakukan check apakah sort dilakukan untuk field yang sama atau berbeda
        const activeSorts = Object.entries(prev).filter(
          ([_, sortDirection]) => sortDirection && sortDirection !== "normal"
        );
        const hasActiveSort = activeSorts.length > 0;
        const isNewColumn =
          hasActiveSort && !activeSorts.some(([colId]) => colId === columnId);
        // Jika melakukan sorting pada field atau kolom baru, maka reset semua sorting
        if (isNewColumn) {
          return {
            [columnId]: newSort,
          };
        }

        // If it's the same column or no active sorts, just update the current column
        return {
          ...prev,
          [columnId]: newSort,
        };
      });
    }, []);

    // Sort icons component - STABLE
    const SortIcon = memo(({ sortState, enabled }) => {
      if (!enabled) return null;

      const icons = {
        asc: <ArrowDownAZ className="w-4 h-4 text-neutral-gray" />,
        desc: <ArrowUpZA className="w-4 h-4 text-neutral-gray" />,
        normal: <ArrowDownUp className="w-4 h-4 text-neutral-gray" />,
      };

      return <span>{icons[sortState] || icons.normal}</span>;
    });

    // Column header component - STABLE
    const ColumnHeader = memo(
      ({
        col,
        column,
        filterConfig,
        shouldEnableSorting,
        openFilter,
        columnFilters,
        applyFilter,
        resetFilter,
        setOpenFilter,
        handleCustomSort,
        customSorting,
      }) => {
        const currentSort = customSorting[col.accessorKey] || "normal";

        const handleSort = useCallback(() => {
          if (shouldEnableSorting) {
            handleCustomSort(col.accessorKey);
          }
        }, [col.accessorKey, shouldEnableSorting, handleCustomSort]);

        return (
          <div className="flex items-center justify-between w-full">
            <div
              className={`flex items-center gap-1 ${shouldEnableSorting ? "cursor-pointer hover:text-primary-normal transition-colors" : ""}`}
              onClick={handleSort}
            >
              {col.header}
            </div>
            <div className="flex items-center gap-1">
              {shouldEnableSorting && (
                <div className="cursor-pointer" onClick={handleSort}>
                  <SortIcon
                    sortState={currentSort}
                    enabled={shouldEnableSorting}
                  />
                </div>
              )}
              {filterConfig && (
                <TableFilter
                  col={col}
                  filterConfig={filterConfig}
                  openFilter={openFilter}
                  columnFilters={columnFilters}
                  applyFilter={applyFilter}
                  resetFilter={resetFilter}
                  setOpenFilter={setOpenFilter}
                />
              )}
            </div>
          </div>
        );
      }
    );

    // Table columns - OPTIMIZED
    const tableColumns = useMemo(() => {
      const baseColumns = [];

      // Add checkbox column if needed - using custom selection pattern
      if (onSelectionChange && getItemId) {
        baseColumns.push({
          id: "checkbox-table",
          size: 5,
          header: () => (
            <Checkbox
              className="ml-2 w-4 h-4"
              value={allSelected}
              onChange={onSelectAllChange}
              disabled={disabled}
            />
          ),
          cell: ({ row }) => {
            const itemId = getItemId(row.original);
            return (
              <Checkbox
                className="ml-2 w-4 h-4"
                value={selectedIds.includes(itemId)}
                onChange={(value) => onSelectionChange(value, itemId)}
                disabled={disabled}
              />
            );
          },
          enableSorting: false,
          enableHiding: false,
        });
      }

      // Add data columns
      baseColumns.push(
        ...columns.map((col) => {
          const shouldEnableSorting = col.sort === true;
          const filterConfig = filterableColumns.find(
            (f) => f.id === col.accessorKey
          );

          return {
            ...col,
            enableSorting: shouldEnableSorting,
            header: ({ column }) => (
              <ColumnHeader
                col={col}
                column={column}
                filterConfig={filterConfig}
                shouldEnableSorting={shouldEnableSorting}
                openFilter={openFilter}
                columnFilters={columnFilters}
                applyFilter={applyFilter}
                resetFilter={resetFilter}
                setOpenFilter={setOpenFilter}
                handleCustomSort={handleCustomSort}
                customSorting={customSorting}
              />
            ),
          };
        })
      );

      // Add actions column if needed
      if (actions.length > 0 && actionType !== "none") {
        baseColumns.push({
          id: "actions",
          headerClassName: actionType === "button" ? "text-center" : "",
          enableSorting: false,
          enableHiding: false,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <TableActions
                row={row}
                actions={actions}
                actionType={actionType}
                actionVariant={actionVariant}
                openPopoverIds={openPopoverIds}
                setOpenPopoverIds={setOpenPopoverIds}
                handleActionClick={handleActionClick}
              />
            </div>
          ),
        });
      }

      return baseColumns;
    }, [
      columns,
      filterableColumns,
      actions,
      onSelectionChange,
      getItemId,
      selectedIds,
      allSelected,
      onSelectAllChange,
      disabled,
      actionType,
      actionVariant,
      openFilter,
      openPopoverIds,
      columnFilters,
      applyFilter,
      resetFilter,
      handleActionClick,
      handleCustomSort,
      customSorting,
    ]);

    const table = useReactTable({
      data: filteredAndSortedData,
      columns: tableColumns,
      state: {
        globalFilter,
      },
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      columnResizeMode: "onChange",
      enableRowSelection: false,
      onGlobalFilterChange: setGlobalFilter,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize,
        },
      },
    });

    const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(
      startIndex + pageSize,
      filteredAndSortedData.length
    );

    React.useEffect(() => {
      table.setPageIndex(currentPage - 1);
    }, [currentPage, table]);

    React.useEffect(() => {
      setCurrentPage(table.getState().pagination.pageIndex + 1);
    }, [table.getState().pagination.pageIndex]);

    const handleFirstPage = () => {
      table.setPageIndex(0);
    };

    const handleLastPage = () => {
      table.setPageIndex(totalPages - 1);
    };

    const handlePreviousPage = () => {
      table.previousPage();
    };

    const handleNextPage = () => {
      table.nextPage();
    };

    return (
      <div className="w-full">
        {/* Selection Banner */}
        {enableSelectionBanner && selectionBannerContent && (
          <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200 bg-white">
            {selectionBannerContent}
          </div>
        )}

        <div className="border rounded-md">
          <div className="bg-background">
            <div
              className="w-full relative"
              style={{
                maxHeight: maxHeight || "auto",
                overflowY: maxHeight ? "auto" : "visible",
              }}
            >
              {/* Add a wrapper div for horizontal scrolling */}
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block relative">
                  <ShadcnTable className="table-fixed w-full">
                    {!hideHeader && <TableHeader table={table} />}
                    {/* Loading State */}
                    {isLoading ? (
                      <tbody>
                        <tr>
                          <td
                            colSpan={tableColumns.length}
                            className="h-32 text-center"
                          >
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-normal"></div>
                              <span className="ml-2">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <TableBody
                        table={table}
                        onRowClick={onRowClick}
                        getCaption={getCaption}
                        emptyStateMessage={emptyStateMessage}
                      />
                    )}
                  </ShadcnTable>
                </div>
              </div>
            </div>
            {pagination && !hidePagination && !isLoading && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredData={filteredAndSortedData}
                handleFirstPage={handleFirstPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                handleLastPage={handleLastPage}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

Table.displayName = "Table";
