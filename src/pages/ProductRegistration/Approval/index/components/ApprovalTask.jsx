import { Table, Tabs } from "@/components/Dexain";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Icons */
import { Eye } from "lucide-react";

/** Constants */
import { approvalColumns } from "../../../RegistrationVariationNotification/constants/table";

const ApprovalTask = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.state?.secondaryTab || "newProductRegistration");

  const columnsNewProductRegistration = approvalColumns.map((col) => {
    const newRegColumn = { ...col };
    if (newRegColumn.accessorKey === "MANUFACTURING_SITE") {
      const options = [
        ...new Set(
          data?.NEW_PRODUCT_REGISTRATION?.map(
            (item) => item.MANUFACTURING_SITE
          )
        ),
      ];
      newRegColumn.filter = "checkbox";
      newRegColumn.option = options;
    }

    if (newRegColumn.accessorKey === "SUBMISSION_STATUS") {
      newRegColumn.accessorKey = "SUBMISSION_STATUS";
      const options = [
        ...new Set(
          data?.NEW_PRODUCT_REGISTRATION?.map(
            (item) => item.SUBMISSION_STATUS
          )
        ),
      ];
      newRegColumn.filter = "checkbox";
      newRegColumn.option = options;
    }

    return newRegColumn;
  });

  const columnsRegVarNotif = approvalColumns.map((col) => {
    const regVarNotifColumn = { ...col };
    if (regVarNotifColumn.accessorKey === "MANUFACTURING_SITE") {
      const options = [
        ...new Set(
          data?.REGISTRATION_VARIATION_AND_NOTIFICATION?.map(
            (item) => item.MANUFACTURING_SITE
          )
        ),
      ];
      regVarNotifColumn.filter = "checkbox";
      regVarNotifColumn.option = options;
    }

    if (regVarNotifColumn.accessorKey === "SUBMISSION_STATUS") {
      regVarNotifColumn.accessorKey = "SUBMISSION_STATUS";
      const options = [
        ...new Set(
          data?.REGISTRATION_VARIATION_AND_NOTIFICATION?.map(
            (item) => item.SUBMISSION_STATUS
          )
        ),
      ];
      regVarNotifColumn.filter = "checkbox";
      regVarNotifColumn.option = options;
    }

    return regVarNotifColumn;
  });

  // const columnsRenewal = approvalColumns;

  const actionNew = useMemo(
    () => [
      {
        icon: <Eye className="w-5 h-5 text-gray-500" />,
        onClick: (row) =>
          navigate(`/product-registration/approval/detail`, {
            state: { submissionId: row.SUBMISSION_ID, registrationType: "New", mainTab: "task", secondaryTab: activeTab },
          }),
      },
    ],
    [navigate, activeTab]
  );

  const actionVariationNotification = useMemo(
    () => [
      {
        icon: <Eye className="w-5 h-5 text-gray-500" />,
        onClick: (row) =>
          navigate(`/product-registration/approval/detail`, {
            state: { submissionId: row.SUBMISSION_ID, registrationType: "VariationNotification", mainTab: "task", secondaryTab: activeTab },
          }),
      },
    ],
    [navigate, activeTab]
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      tabs={[
        {
          value: "newProductRegistration",
          label: "New Product Registration",
          count: data?.NEW_PRODUCT_REGISTRATION?.length || 0,
          content: (
            <Table
              columns={columnsNewProductRegistration}
              data={data?.NEW_PRODUCT_REGISTRATION || []}
              actions={actionNew}
              actionType="button"
              actionVariant="icon"
              pagination={true}
              pageSize={10}
              searchable
            />
          ),
        },
        {
          value: "regVarNotif",
          label: "Registration Variation & Notification",
          count: data?.REGISTRATION_VARIATION_AND_NOTIFICATION?.length || 0,
          content: (
            <Table
              columns={columnsRegVarNotif}
              data={data?.REGISTRATION_VARIATION_AND_NOTIFICATION || []}
              actions={actionVariationNotification}
              actionType="button"
              actionVariant="icon"
              pagination={true}
              pageSize={10}
              searchable
            />
          ),
        },
        // {
        //   value: "renewal",
        //   label: "Registration Renewal",
        //   count: data?.REGISTRATION_RENEWAL?.length || 0,
        //   content: (
        //     <Table
        //       columns={columnsRenewal}
        //       data={data?.REGISTRATION_RENEWAL || []}
        //       actions={actions}
        //       actionType="button"
        //       actionVariant="icon"
        //       pagination={true}
        //       pageSize={10}
        //       searchable
        //     />
        //   ),
        // },
      ]}
    />
  );
};

export default ApprovalTask;
