import { Table } from "@/components/Dexain";
import { Eye } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useUIStore } from "@/stores/uiStore";

import { ProductRegistration } from "../ProductRegistrationDetail/index";

import { useGetMarketingAuthorizationDatabaseAccess } from "../hooks/useMarketingAuthorizationDatabase";

export const NIETable = ({ data = [] }) => {
  const { addStack } = useUIStore();
  const { data: accessData, isLoading: isAccessLoading, error: accessError } = useGetMarketingAuthorizationDatabaseAccess();

  const columns = [
    { id: "#", accessorKey: "MARKETING_AUTHORIZATION_ID", header: "#", size: 25, cell: ({ row }) => row.index + 1 },
    {
      id: "Finished Product",
      accessorKey: "FINISHED_PRODUCT_DESCRIPTION",
      header: "Finished Product",
      sort: true,
      size: 120,
      cell: ({ row }) => {
        const productName = row.original.FINISHED_PRODUCT_DESCRIPTION;
        const version = row.original.VERSION;
        return (
          <div className="flex flex-col items-start">
            <span className="text-base font-semibold">{productName}</span>
            <span className="text-m text-gray-600">Latest Version: {version}</span>
          </div>
        );
      },
    },
    {
      id: "NIE/MA Details",
      accessorKey: "NIE_MA_NO",
      header: "NIE/MA Details",
      sort: true,
      size: 100,
      cell: ({ row }) => {
        const nieMaNo = row.original.NIE_MA_NO;
        const maHolder = row.original.NIE_MA_HOLDER;
        return (
          <div className="flex flex-col items-start">
            <span className="text-base font-semibold">{nieMaNo || "-"}</span>
            <span className="text-m text-gray-600">
              Status: <span className="font-semibold text-green-400">EFFECTIVE</span>
            </span>
            <span className="text-m text-gray-600">NIE/MA Holder: {maHolder || "-"}</span>
          </div>
        );
      },
    },
    {
      id: "Product Details",
      accessorKey: "REGULATORY_DOSAGE_FORM",
      header: "Product Details",
      sort: true,
      size: 100,
      cell: ({ row }) => {
        const dosage = row.original.REGULATORY_DOSAGE_FORM;
        const packSize = row.original.REGULATORY_PACK_SIZE;
        const registrationProductCategory = row.original.REGULATORY_PRODUCT_CATEGORY;
        return (
          <div className="flex flex-row items-start gap-2">
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">{registrationProductCategory || "-"}</span>
              <span className="text-m text-gray-600">Dosage form: {dosage || "-"}</span>
              <span className="text-m text-gray-600">Pack Size: {packSize || "-"}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "Active Ingredients",
      accessorKey: "ACTIVE_INGREDIENTS",
      header: "Active Ingredients",
      size: 100,
      cell: ({ row }) => {
        const activeIngredients = row.original.ACTIVE_INGREDIENTS || [];
        return (
          <ul className="list-disc list-inside">
            {activeIngredients.map((ingredient, index) => (
              <li className="font-medium" key={index}>
                {`${ingredient}`}
              </li>
            ))}
          </ul>
        );
      },
    },
    { id: "Country", accessorKey: "COUNTRY", header: "Country", sort: true, size: 70 },
    { id: "Dev Category", accessorKey: "DEVELOPMENT_CATEGORY", header: "Dev Category", sort: true, size: 80 },
    { id: "MFG Site", accessorKey: "MANUFACTURING_SITE", header: "MFG Site", sort: true, size: 80 },
  ];

  const handleOpenSheet = useCallback(
    (data) => {
      addStack({
        title: (<span className="text-xl font-bold">Product Registration Details</span>),
        type: "sheet",
        description: (<span className="text-lg text-black">{data.FINISHED_PRODUCT_DESCRIPTION}</span>),
        size: "xl",
        content: (<ProductRegistration FINISHED_PRODUCT_DESCRIPTION={data.FINISHED_PRODUCT_DESCRIPTION} accessData={accessData}></ProductRegistration>),
      });
    },
    [addStack]
  );

  // Define row actions with access control check
  const actions = useMemo(() => {
    // Only show actions if user has view access
    if (accessData?.CAN_VIEW === "Y") {
      return [
        {
          icon: <Eye />,
          onClick: (rowData, event) => {
            handleOpenSheet(rowData);
          },
        },
      ];
    }
    // Return empty array if no access
    return [];
  }, [accessData?.CAN_VIEW, handleOpenSheet]);

  // Memoize data and columns
  const memoizedColumns = useMemo(() => columns, []);
  const memoizedData = useMemo(() => data, [data]);

  return <Table columns={memoizedColumns} data={memoizedData} actions={actions} pagination={true} pageSize={10} actionType="button" actionVariant="icon" />;
};