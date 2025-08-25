import React from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export const TablePagination = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredData,
  handleFirstPage,
  handlePreviousPage,
  handleNextPage,
  handleLastPage,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-t rounded-b-md">
      <div className="text-sm text-gray-500 w-36 mt-1 mb-1">
        Showing {startIndex + 1} to{" "}
        {Math.min(endIndex, filteredData.length)} of{" "}
        {filteredData.length} entries
      </div>
      <Pagination className="flex justify-end mt-1 mb-1">
        <PaginationContent className="flex border border-gray-200 rounded-sm">
          <PaginationItem>
            <PaginationLink
              onClick={() => currentPage === 1 ? null : handleFirstPage()}
              className={`h-8 w-8 p-0 flex items-center justify-center  ${currentPage === 1 ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "cursor-pointer"}`}
              disabled={currentPage === 1}
            >
              <MdKeyboardDoubleArrowLeft className="h-5 w-5" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => currentPage === 1 ? null : handlePreviousPage()}
              className={`h-8 w-8 p-0 flex items-center justify-center ${currentPage === 1 ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "cursor-pointer"}`}
              disabled={currentPage === 1}
            >
              <MdKeyboardArrowLeft className="h-5 w-5" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem className="bg-soft-red h-8 min-w-[2rem] flex items-center justify-center">
            <span className="text-dark-red font-bold text-md">
              {currentPage}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => currentPage === totalPages ? null : handleNextPage()}
              className={`h-8 w-8 p-0 flex items-center justify-center ${currentPage === totalPages ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "cursor-pointer"}`}
              disabled={currentPage === totalPages}
            >
              <MdKeyboardArrowRight className="h-5 w-5" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => currentPage === totalPages ? null : handleLastPage()}
              className={`h-8 w-8 p-0 flex items-center justify-center ${currentPage === totalPages ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "cursor-pointer"}`}
              disabled={currentPage === totalPages}
            >
              <MdKeyboardDoubleArrowRight className="h-5 w-5" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}; 