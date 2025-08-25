import { History, List } from "lucide-react";

/** Components */
import { Skeleton, Tabs } from "@/components/Dexain";
import ApprovalHistory from "./components/ApprovalHistory";
import ApprovalTask from "./components/ApprovalTask";

/** Constants */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useApprovalHistory, useApprovalTask } from "../hooks/useApproval";

/** Data Test Id */
// import { createTestIdProps } from "@/lib/utils";

const Approval = () => {
  const location = useLocation();

  /** Use Query */
  const { data: approvalsTasks, isLoading: isLoadingApprovalsTasks } =
    useApprovalTask();
  const { data: approvalsHistory, isLoading: isLoadingApprovalsHistory } =
    useApprovalHistory();

  /** Declare Local State */
  const [activeMainTab, setActiveMainTab] = useState(
    location?.state?.mainTab || "task"
  );

  /** Create Test Id */
  // const tabsTestId = createTestIdProps("approval-tabs");

  return isLoadingApprovalsTasks || isLoadingApprovalsHistory ? (
    <div className="flex justify-center items-center h-screen">
      <Skeleton className="w-full h-[90vh] m-4" />
    </div>
  ) : (
    <Tabs
      value={activeMainTab}
      onValueChange={(value) => setActiveMainTab(value)}
      sticky="top"
      style="underline"
      tabs={[
        {
          value: "task",
          label: "Approval Task",
          count: Object.values(approvalsTasks).flat().length || 0,
          icon: List,
          content: (
            <div
              className="h-[calc(100vh-56px)] overflow-y-auto p-4"
            >
              <div className="mb-4 space-y-1">
                <h2 className="text-xl font-semibold">
                  Registration Submission Approval
                </h2>
                <p className="text-gray-600 text-sm">
                  Review and make decisions on the registration submission.
                </p>
              </div>
              <ApprovalTask data={approvalsTasks} />
            </div>
          ),
        },
        {
          value: "history",
          label: "Approval History",
          icon: History,
          content: (
            <div className="h-[calc(100vh-56px)] overflow-y-auto p-4">
              <div className="mb-4 space-y-1">
                <h2 className="text-xl font-semibold">
                  Registration Submission Approval History
                </h2>
                <p className="text-gray-600 text-sm">
                  List of Registration submissions you have approved.
                </p>
              </div>
              <ApprovalHistory data={approvalsHistory} />
            </div>
          ),
        },
      ]}
    />
  );
};

export default Approval;
