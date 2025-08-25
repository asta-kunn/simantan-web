import React from "react";
import dayjs from "dayjs";;
import { useNavigate } from "react-router-dom";
import { Table } from "@/components/fields/Table";
import { Eye } from "lucide-react";

/**
 * History Table component using Table component with column pinning
 */
const HistoryTable = ({ data, filterableColumns = [] }) => {
  const navigate = useNavigate();

  // Handle view action click
  const handleViewRequest = (request) => {
    // Store complete request data in localStorage
    localStorage.setItem('selectedRequestData', JSON.stringify(request));
    
    // Navigate to the proposal detail page with the request ID
    navigate(`/epi/new-request/detail?requestId=${request.requestNo}`);
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        No history data available
      </div>
    );
  }

  // Define columns for the table
  const columns = [
    {
      accessorKey: "__rowNumber",
      enablePinning: true,
      size: 60,
    },
    {
      accessorKey: "requestNo",
      header: "Request No",
      enablePinning: true,
      size: 140,
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 140,
    },
    {
      accessorKey: "subCategory",
      header: "Sub Category",
      size: 160,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="truncate max-w-[140px]">{row.original.title}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "submittedDate",
      header: "Submitted Date",
      cell: ({ row }) => (
        <div>
          <div className="text-xs">{dayjs(row.original.submittedDate).format("DD MMMM YYYY")},</div>
          <div className="text-xs">{dayjs(row.original.submittedDate).format("HH:mm:ss")}</div>
        </div>
      ),
      size: 160,
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ row }) => (
        <div className="text-xs">{dayjs(row.original.createdDate).format("DD MMMM YYYY")}</div>
      ),
      size: 160,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 140,
    }
  ];

  // Define filter columns
  const tableFilterColumns = filterableColumns.map(filter => ({
    ...filter,
    // Convert date types to the expected format
    type: filter.type === 'date' || filter.type === 'datetime' 
      ? (filter.type === 'date' ? 'date' : 'datetime') 
      : filter.type === 'checkbox' ? 'checkbox' : 'text'
  }));

  // Define actions
  const actions = [
    {
      label: "View",
      onClick: handleViewRequest
    }
  ];

  // Set default column pinning
  const columnPinning = {
    left: ['__rowNumber', 'requestNo'],
    right: ['actions']
  };

  // Calculate a reasonable table width based on column sizes
  // Add extra width for actions column which is not defined above
  const totalColumnWidth = columns.reduce((total, col) => total + (col.size || 100), 0) + 100;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <Table
          columns={columns}
          data={data}
          filterableColumns={tableFilterColumns}
          actions={actions}
          pagination={true}
          enableFullSorting={true}
          actionType="button"
          actionHeader="View"
          actionVariant="icon"
          columnPinning={columnPinning}
          style={{ width: `${totalColumnWidth}px` }} // Dynamic width based on columns
          className="sticky-table"
        />
      </div>
    </div>
  );
};

export default HistoryTable; 