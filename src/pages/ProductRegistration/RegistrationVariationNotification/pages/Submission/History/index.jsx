import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "../../../constants/table";

import { Info, Table } from "@/components/Dexain";
import { Eye } from "lucide-react";

const SubmissionHistory = ({ data }) => {
  const navigate = useNavigate();

  const columnsWithFilter = columns.map((column) => {
    if (column.accessorKey === "TASK_NAME") {
      column.accessorKey = "TASK_NAME";
      column.filter = "checkbox";
      column.option = [
        ...new Set(
          data
            ?.filter((item) => item.TASK_NAME !== null)
            .map((item) => item.TASK_NAME).sort()
        ),
      ];
    }
    if (column.accessorKey === "SUBMISSION_STATUS") {
      column.accessorKey = "SUBMISSION_STATUS";
      column.filter = "checkbox";
      column.option = [...new Set(data?.map((item) => item.SUBMISSION_STATUS).sort())];
    }
    if (column.accessorKey === "MANUFACTURING_SITE") {
      column.accessorKey = "MANUFACTURING_SITE";
      column.filter = "checkbox";
      column.option = [
        ...new Set(data?.map((item) => item.MANUFACTURING_SITE).sort()),
      ];
    }
    return column;
  });

  const actions = useMemo(
    () => [
      {
        label: "Actions",
        icon: <Eye />,
        onClick: (row) =>
          navigate(
            `/product-registration/variation-notification/submission/detail`,
            {
              state: {
                submissionId: row.SUBMISSION_ID,
              },
            }
          ),
      },
    ],
    [navigate]
  );

  return (
    <div className="flex flex-col gap-2">
      <Info
        containerClassName="mb-2"
        label="Submission History"
        labelClassName="font-bold text-black text-xl"
        value="List of registration submission that have completed all processes"
        valueClassName="text-neutral-gray text-sm font-normal"
      />
      <Table
        columns={columnsWithFilter}
        data={data}
        actions={actions}
        actionType="button"
        actionVariant="icon"
      />
    </div>
  );
};

export default SubmissionHistory;
