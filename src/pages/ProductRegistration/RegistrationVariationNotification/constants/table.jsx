import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { Eye } from "lucide-react";
import dayjs from "dayjs";

/** Constants */
import { getStatusColor } from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";

export const columns = [
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
    accessorKey: "PIC_RA_NAME",
    filter: "text",
    sort: true,
    cell: ({ row }) => {
      return (
        <>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.PIC_RA_NAME}</span>
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

export const approvalColumns = [
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
    accessorKey: "PIC_RA_NAME",
    filter: "text",
    sort: true,
    cell: ({ row }) => {
      return (
        <>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.PIC_RA_NAME}</span>
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
    header: "Submission Status",
    accessorKey: "SUBMISSION_STATUS",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.SUBMISSION_STATUS);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.TASK_NAME}</span>
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

export const actions = memo(({ url }) => {
  const navigate = useNavigate();

  return [
    {
      icon: <Eye className="text-gray-500" />,
      onClick: (row) => {
        navigate(url, { state: { submissionId: row.SUBMISSION_ID } });
      },
    },
  ];
});
