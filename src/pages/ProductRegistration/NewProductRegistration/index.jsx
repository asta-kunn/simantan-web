import { Tabs } from "@/components/Dexain";
import { userRole } from "@/constants/role.constant";
import authStore from "@/stores/authStore";
import { History, List, ListPlus } from "lucide-react";
import { useEffect, useState } from "react";
import NewProductRegistrationNewTask from "./NewTask/index";
import AssignedTable from "./Submission/Assigned/components/AssginedTable";
import AssignedHeader from "./Submission/Assigned/components/AssignedHeader";
import NewProductRegistrationSubmissionMonitoring from "./Submission/Monitoring/index";
import { newRegTaskFilterMap, submissionStatusKey } from "./constants/general";
import { useGetSubmissions } from "./hooks/useNewRegSubmission";
import { useGetUnassignedTasks } from "./hooks/useNewRegTask";

const NewProductRegistration = () => {
  const { user } = authStore();

  const [activeTab, setActiveTab] = useState(
    user?.ROLE_CODE === userRole.RA_PMO ? "NEW_TASK" : "MY_TASK"
  );
  const [secondaryActiveTab, setSecondaryActiveTab] = useState(
    submissionStatusKey.IN_PROGRESS
  );
  const [selectedFilter, setSelectedFilter] = useState("PCF No");
  const [searchInput, setSearchInput] = useState("");

  const { unassignedTasks, isLoadingUnassignedTasks, refetchUnassignedTasks } = useGetUnassignedTasks(newRegTaskFilterMap[selectedFilter], searchInput);
  const { submissions, isLoadingSubmissions, refetchSubmissions } = useGetSubmissions(secondaryActiveTab);

  useEffect(() => {
    refetchUnassignedTasks();
    refetchSubmissions();
  }, [refetchUnassignedTasks, refetchSubmissions]);

  const handleRefetch = (newFilter, newSearchInput) => {
    refetchUnassignedTasks(newFilter, newSearchInput);
    refetchSubmissions(newFilter, newSearchInput);
  };

  const renderTabs = () => {
    switch (user?.ROLE_CODE) {
      case userRole.RA_PMO:
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
                icon: ListPlus,
                content: (
                  <NewProductRegistrationNewTask
                    isLoading={isLoadingUnassignedTasks}
                    unassignedTasks={unassignedTasks}
                    onRefetch={handleRefetch}
                    onChangeTab={setActiveTab}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                  />
                ),
              },
              {
                value: "SUBMISSION_MONITORING",
                label: "Submission Monitoring",
                icon: List,
                content: (
                  <NewProductRegistrationSubmissionMonitoring
                    isLoading={isLoadingSubmissions}
                    submissions={submissions}
                    onRefetch={handleRefetch}
                    activeTab={secondaryActiveTab}
                    setActiveTab={setSecondaryActiveTab}
                  />
                ),
              },
            ]}
          />
        );
      case userRole.RA_OFFICER:
        return (
          <Tabs
            sticky="top"
            style="underline"
            value={activeTab || "MY_TASK"}
            onValueChange={setActiveTab}
            tabs={[
              {
                value: "MY_TASK",
                label: "My Task",
                icon: ListPlus,
                content: (
                  <div className="p-6 space-y-4">
                    <AssignedHeader statusKey={submissionStatusKey.IN_PROGRESS} />
                    <AssignedTable statusKey={submissionStatusKey.IN_PROGRESS} />
                  </div>
                ),
              },
              {
                value: "HISTORY",
                label: "History",
                icon: History,
                content: (
                  <div className="p-6 space-y-4">
                    <AssignedHeader statusKey={submissionStatusKey.COMPLETED} />
                    <AssignedTable statusKey={submissionStatusKey.COMPLETED} />
                  </div>
                ),
              },
            ]}
          />
        );
      default:
        return (
          <NewProductRegistrationSubmissionMonitoring
            submissions={submissions}
            onRefetch={handleRefetch}
            activeTab={secondaryActiveTab}
            setActiveTab={setSecondaryActiveTab}
          />
        );
    }
  };

  return renderTabs();
};

export default NewProductRegistration;
