import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Table } from "@/components/Dexain";
import { Eye } from "lucide-react";

/** Constants */
import { columns } from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/table";

const TableMonitoring = ({ statusKey, data }) => {
  const navigate = useNavigate();

  const columnsWithFilter = columns.map((column) => {
    if (column.accessorKey === "TASK_NAME") {
      column.accessorKey = "TASK_NAME";
      const options = [
        ...new Set(
          data
            ?.filter((item) => item.TASK_NAME !== null)
            .map((item) => item.TASK_NAME).sort()
        ),
      ];
      column.filter = "checkbox";
      column.option = options;
    }

    if (column.accessorKey === "SUBMISSION_STATUS") {
      column.accessorKey = "SUBMISSION_STATUS";
      const options = [...new Set(data?.map((item) => item.SUBMISSION_STATUS).sort())];
      column.filter = "checkbox";
      column.option = options;
    }

    if (column.accessorKey === "MANUFACTURING_SITE") {
      column.accessorKey = "MANUFACTURING_SITE";
      const options = [
        ...new Set(data?.map((item) => item.MANUFACTURING_SITE).sort()),
      ];
      column.filter = "checkbox";
      column.option = options;
    }

    return column;
  });

  const actions = useMemo(
    () => [
      {
        icon: <Eye className="text-gray-500" />,
        onClick: (row) => {
          navigate(
            `/product-registration/variation-notification/submission/detail`,
            { 
              state: { 
                tab: "SUBMISSION_MONITORING",
                secondaryTab: statusKey,
                submissionId: row.SUBMISSION_ID,
              },
            }
          );
        },
      },
    ],
    [navigate, statusKey]
  );

  return (
    <Table
      columns={columnsWithFilter}
      data={data}
      actions={actions}
      actionType="button"
      actionVariant="icon"
    />
  );
};

export default TableMonitoring;
