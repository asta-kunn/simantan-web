import { Tabs } from "@/components/Dexain";
import authStore from "@/stores/authStore";
import { History, User } from "lucide-react";
import React from "react";

const TableHistory = React.lazy(
  () => import("../ProductRegistration/RegistrationVariationNotification/Submission/Assigned/components/TableHistory")
);

const TableMonitoring = React.lazy(
  () => import("../ProductRegistration/RegistrationVariationNotification/Submission/Monitoring/components/TableMonitoring")
);

const Approval = () => {
  const user = authStore((state) => state.user);
  const roleCode = user?.ROLE_CODE;

  // Check if user has access to Approval page
  const hasAccess = roleCode === 'RA_MGR_INA' || roleCode === 'RA_MGR_OVERSEAS' || roleCode === 'SUPERUSER';

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
          <p className="text-gray-500 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-gray-400">
            Only RA Manager (Indonesia), RA Manager (Overseas), and Super User can access the Approval page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Tabs
      style="underline"
      tabs={[
        {
          value: "1",
          label: "My Task",
          count: 8,
          icon: User,
          content: (
            <div className="h-[calc(100vh-56px)] overflow-y-auto p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Registration Submission
                </h2>
                <p className="text-gray-600 text-sm">
                  Review and make decisions on the registration submission.
                </p>
              </div>
              <TableMonitoring filter="waiting" tabContext="mytask" />
            </div>
          ),
        },
        {
          value: "2",
          label: "History",
          count: 12,
          icon: History,
          content: (
            <div className="h-[calc(100vh-56px)] overflow-y-auto p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Task History
                </h2>
                <p className="text-gray-600 text-sm">
                  List of registration submission that have completed all processes
                </p>
              </div>
              <TableHistory tabContext="history" />
            </div>
          ),
        },
      ]}
    />
  );
};

export default Approval;
