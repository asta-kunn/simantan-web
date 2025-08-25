import Loading from "@/components/common/Loading";
import { Tabs } from "@/components/Dexain";
import authStore from "@/stores/authStore";
import { History, List, ListPlus, User } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { useLocation } from "react-router-dom";

// Hooks
import { submissionStatus } from "./constants/general";
import { useGetSubmissionAssigned } from "./hooks/useSubmission";

// Components
const NewTask = lazy(() => import("./pages/NewTask/index"));
const SubmissionMonitoring = lazy(() => import("./pages/Submission/Monitoring/index"));
const RegistrationSubmissionAssigned = lazy(() => import("./pages/Submission/Assigned/index"));
const SubmissionHistory = lazy(() => import("./pages/Submission/History/index"));

const RegistrationVariationNotification = () => {
  const location = useLocation();
  const user = authStore((state) => state.user);
  const [activeTab, setActiveTab] = useState(location?.state?.tab || "NEW_TASK");
  const [myTaskCountPMO, setMyTaskCountPMO] = useState(0);

  const { data: submissionsAssigned } = useGetSubmissionAssigned(user?.ROLE_CODE);

  const myTask = submissionsAssigned?.filter(submission => submission.SUBMISSION_STATUS === submissionStatus.IN_PROGRESS);
  const myHistory = submissionsAssigned?.filter(submission => submission.SUBMISSION_STATUS !== submissionStatus.IN_PROGRESS);

  const renderTabs = () => {
    const roleCode = user?.ROLE_CODE;
    switch (roleCode) {
      case "RA_PMO":
        return (
          <Tabs
            sticky="top"
            style="underline"
            value={activeTab || "NEW_TASK"}
            onValueChange={setActiveTab}
            tabs={[
              {
                value: "NEW_TASK",
                label: "New Task",
                count: myTaskCountPMO,
                icon: ListPlus,
                content: <NewTask onDataCountChange={setMyTaskCountPMO} onSwitchTab={setActiveTab} />,
              },
              {
                value: "SUBMISSION_MONITORING",
                label: "Submission Monitoring",
                icon: List,
                content: <SubmissionMonitoring />,
              },
            ]}
          />
        );
      case "RA_OPS":
        return (
          <Tabs
            sticky="top"
            style="underline"
            tabs={[
              {
                value: "MY_TASK",
                label: "My Task",
                count: myTask?.length || 0,
                icon: User,
                content: (
                  <div className="p-4">
                    <RegistrationSubmissionAssigned data={myTask} />
                  </div>
                ),
              },
              {
                value: "SUBMISSION_HISTORY",
                label: "History",
                icon: History,
                content: (
                  <div className="p-4">
                    <SubmissionHistory data={myHistory} />
                  </div>
                ),
              },
            ]}
          />
        );
      default:
        return <SubmissionMonitoring />;
    }
  };

  return (
    <Suspense fallback={<Loading className="mx-auto" />}>
      <div className="flex flex-col">{renderTabs()}</div>
    </Suspense>
  );
};

export default RegistrationVariationNotification;
