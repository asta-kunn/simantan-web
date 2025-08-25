import { Info } from "@/components/Dexain";
import { submissionStatusKey } from "../../../constants/general";

const AssignedHeader = ({ statusKey }) => {
  return (
    <div className="flex items-center justify-between">
      <Info
        label={statusKey === submissionStatusKey.IN_PROGRESS ? "Registration Submission Assigned" : "Task History"}
        labelClassName="font-bold text-black text-xl"
        value={(
          <p className="text-muted-foreground font-medium text-sm">
            {statusKey === submissionStatusKey.IN_PROGRESS ? "List of registration submissions from PMO that you need to process." : "List of registration submissions that have completed all processes."}
          </p>
        )}
      />
    </div>
  );
};

export default AssignedHeader;