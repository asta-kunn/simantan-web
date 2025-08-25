import dayjs from "dayjs";
import { getStatusColor } from "./general";

export const newRegNewTaskColumns = [
  {
    accessorKey: "FINISHED_PRODUCT_DESCRIPTION",
    header: "Finished Product Description",
    cell: ({ row }) => row.original.FINISHED_PRODUCT_DESCRIPTION || "-",
    filter: "text",
  },
  {
    accessorKey: "NIE_MA_HOLDER",
    header: "NIE MA Holder",
    cell: ({ row }) => row.original.NIE_MA_HOLDER || "-",
    filter: "text",
  },
  {
    accessorKey: "MANUFACTURING_SITE",
    header: "Manufacturing Site",
    cell: ({ row }) => row.original.MANUFACTURING_SITE || "-",
    filter: "text",
  },
  {
    accessorKey: "COUNTRY",
    header: "Country",
    cell: ({ row }) => row.original.COUNTRY || "-",
    filter: "text",
  },
  {
    accessorKey: "CREATED_AT",
    header: "Created At",
    cell: ({ row }) => dayjs(row.original.CREATED_AT).format("DD MMM YYYY HH:mm"),
    filter: "date",
  },
];

export const newRegSubmissionMonitoringColumns = [
  {
    header: "Submission ID",
    accessorKey: "SUBMISSION_NO",
    filter: "text",
    sort: true,
  },
  {
    header: "Finished Product",
    accessorKey: "FINISHED_PRODUCT_DESCRIPTION",
    filter: "text",
    sort: true,
  },
  {
    header: "Manufacturing Site",
    accessorKey: "MANUFACTURING_SITE",
    filter: "select",
    option: [],
    sort: true,
  },
  {
    header: "PIC",
    accessorKey: "PIC_RA",
    filter: "text",
    sort: true,
    cell: ({ row }) => {
      return (
        <>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.PIC_RA.NAME}</span>
            <span className="text-sm font-semibold text-neutral-gray">
              Assign Date:{" "}
              {row.original.ASSIGNED_AT
                ? dayjs(row.original.ASSIGNED_AT).format("DD MMMM YYYY")
                : "-"}
            </span>
          </div>
        </>
      );
    },
  },
  {
    header: "Current Task",
    accessorKey: "TASK_NAME",
    filter: "checkbox",
    option: [],
    sort: true,
  },
  {
    header: "Submission Status",
    accessorKey: "SUBMISSION_STATUS",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.SUBMISSION_STATUS);
      return (
        <div className="flex flex-col">
          {/* <span className="font-medium">{row.original.TASK_NAME}</span> */}
          <span className={`text-sm font-semibold text-${statusColor}-normal`}>
            {row.original.SUBMISSION_STATUS}
          </span>
        </div>
      );
    },
    filter: "checkbox",
    option: [],
  },
];

export const newRegSubmissionAssignedColumns = [
  {
    header: "Submission ID",
    accessorKey: "SUBMISSION_NO",
    filter: "text",
    sort: true,
  },
  {
    header: "Finished Product",
    accessorKey: "FINISHED_PRODUCT_DESCRIPTION",
    filter: "text",
    sort: true,
  },
  {
    header: "Manufacturing Site",
    accessorKey: "MANUFACTURING_SITE",
    filter: "select",
    option: [],
    sort: true,
  },
  {
    header: "Current Task",
    accessorKey: "TASK_NAME",
    filter: "checkbox",
    option: [],
    sort: true,
  },
  {
    header: "Submission Status",
    accessorKey: "SUBMISSION_STATUS",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.SUBMISSION_STATUS);
      return (
        <div className="flex flex-col">
          {/* <span className="font-medium">{row.original.TASK_NAME}</span> */}
          <span className={`text-sm font-semibold text-${statusColor}-normal`}>
            {row.original.SUBMISSION_STATUS}
          </span>
        </div>
      );
    },
    filter: "checkbox",
    option: [],
  },
];
