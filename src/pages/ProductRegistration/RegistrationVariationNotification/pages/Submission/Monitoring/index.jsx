import { Info, Skeleton, Tabs } from "@/components/Dexain";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Components */
import TableMonitoring from "./components/TableMonitoring";

/** Hooks */
import {
  useGetCompletedSubmission,
  useGetInProgressSubmission,
} from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useSubmission";

const RegistrationVariationNotificationSubmissionMonitoring = () => {
  /** Hooks */
  const location = useLocation();
  const {
    inProgressSubmissions,
    isLoadingInProgressSubmission,
    refetchInProgressSubmission,
  } = useGetInProgressSubmission();

  const {
    completedSubmissions,
    isLoadingCompletedSubmission,
    refetchCompletedSubmission,
  } = useGetCompletedSubmission();

  /** States */
  const [activeTab, setActiveTab] = useState(location?.state?.secondaryTab || "IN_PROGRESS");

  // Listen for refresh events from task assignment
  useEffect(() => {
    const handleRefreshMonitoring = () => {
      // Refetch both in progress and completed submissions
      refetchInProgressSubmission();
      refetchCompletedSubmission();
    };

    // Add event listener
    window.addEventListener('refreshSubmissionMonitoring', handleRefreshMonitoring);

    // Cleanup event listener
    return () => {
      window.removeEventListener('refreshSubmissionMonitoring', handleRefreshMonitoring);
    };
  }, [refetchInProgressSubmission, refetchCompletedSubmission]);

  return (
    <div className="flex flex-col gap-2 p-6">
      <Info
        containerClassName="mb-2"
        label="Registration Submission Monitoring"
        labelClassName="font-bold text-black text-xl"
        value="Monitor and review the ongoing registration submission activities."
        valueClassName="text-neutral-gray text-sm font-normal"
      />
      <Tabs
        style="pill"
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          {
            value: "IN_PROGRESS",
            label: "In Progress",
            content: (
              <Skeleton isLoading={isLoadingInProgressSubmission}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TableMonitoring
                    statusKey="IN_PROGRESS"
                    data={inProgressSubmissions}
                  />
                </motion.div>
              </Skeleton>

            ),
          },
          {
            value: "COMPLETED",
            label: "Completed",
            content: (
              <Skeleton isLoading={isLoadingCompletedSubmission}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TableMonitoring
                    statusKey="COMPLETED"
                    data={completedSubmissions}
                  />
                </motion.div>
              </Skeleton>
            ),
          },
        ]}
      />
    </div>
  );
};

export default RegistrationVariationNotificationSubmissionMonitoring;
