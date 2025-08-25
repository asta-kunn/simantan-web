import { Table } from "@/components/Dexain";
import { cleanTableObject } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { newRegNewTaskColumns } from "../../constants/tables";

const TaskAccordionTable = ({ pcfNo, data, onAssignTask, disabled = false }) => {
  const actions = [
    {
      icon: <SendHorizontal className="text-primary-normal size-4" />,
      label: "Assign Task",
      buttonVariant: "default",
      onClick: (rowData) => onAssignTask({ ...cleanTableObject(rowData), PCF_NO: pcfNo }),
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full [&_.border]:border-0 [&_.rounded-md]:rounded-none [&_.overflow-visible]:overflow-visible [&_div.relative]:w-full [&_table]:w-full [&_.border.rounded-md]:!border-0 [&_.border.rounded-md]:!rounded-none">
        <Table
          data={data}
          columns={newRegNewTaskColumns}
          actions={actions}
          pageSize={10}
          pagination={data.length > 10}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default TaskAccordionTable;