import { Skeleton, Tabs } from "@/components/Dexain";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { submissionStatus, submissionStatusKey } from "../../constants/general";
import { useGetSubmissions } from "../../hooks/useNewRegSubmission";
import MonitoringTable from "./components/MonitoringTable";
import SubmissionHeader from "./components/SubmissionHeader";

const NewProductRegistrationSubmissionMonitoring = ({ activeTab, setActiveTab }) => {
  const { submissions, isLoadingSubmissions, refetchSubmissions } = useGetSubmissions(activeTab);

  useEffect(() => {
    refetchSubmissions();
  }, [refetchSubmissions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="mx-auto p-6 space-y-4"
    >
      <SubmissionHeader />
      <Tabs
        value={activeTab || submissionStatusKey.IN_PROGRESS}
        onValueChange={setActiveTab}
        tabs={[
          {
            value: submissionStatusKey.IN_PROGRESS,
            label: submissionStatus.IN_PROGRESS,
            content: isLoadingSubmissions ? (
              <Skeleton className="w-full h-[40vh]" />
            ) : (
              <MonitoringTable
                statusKey={submissionStatusKey.IN_PROGRESS}
                data={submissions}
              />
            ),
          },
          {
            value: submissionStatusKey.COMPLETED,
            label: submissionStatus.COMPLETED,
            content: isLoadingSubmissions ? (
              <Skeleton className="w-full h-[40vh]" />
            ) : (
              <MonitoringTable
                statusKey={submissionStatusKey.COMPLETED}
                data={submissions}
              />
            ),
          },
        ]}
      />
    </motion.div>
  );
};

export default NewProductRegistrationSubmissionMonitoring;