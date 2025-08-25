import { Button, Info } from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { Plus } from "lucide-react";
import AddNewTaskForm from "./AddNewTaskForm";

const NewTaskHeader = ({ onSubmitNewTask, isLoading, onRefetch }) => {
  const { addStack, closeStack, clearStacks } = useUIStore();

  const actions = {
    openAddNewTaskForm: () => addStack({
      size: "3xl",
      title: "Add New Task",
      content: (
        <AddNewTaskForm
          onSubmitNewTask={onSubmitNewTask}
          onRefetch={onRefetch}
          stackMethods={{ addStack, closeStack, clearStacks }}
          isLoading={isLoading}
        />
      ),
    }),
  };

  return (
    <div className="flex items-center justify-between">
      <Info
        label="Registration Submission Requests"
        labelClassName="font-bold text-black text-xl"
        value={(
          <p className="text-muted-foreground font-medium text-sm">
            Add a new task and assign registration submission to PIC
          </p>
        )}
      />
      <Button onClick={actions.openAddNewTaskForm}>
        <Plus className="size-3" /> New Task
      </Button>
    </div>
  );
};

export default NewTaskHeader;