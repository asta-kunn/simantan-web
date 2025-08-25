import { Table } from "@/components/Dexain";
import { PencilLine } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";
import { ModalDetailV2 } from "../ItemMasterDetail";
import { createTestIdProps } from "@/lib/utils";

// Fungsi utama untuk mendapatkan distinct values
export const getDistinctValues = (data, field) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  const values = new Set();

  data.forEach((item, index) => {
    if (!item) {
      return;
    }

    switch (field) {
      case "COUNTRY":
        if (item.COUNTRY) {
          values.add(String(item.COUNTRY));
        }
        break;

      case "MARKETING_AUTHORIZATION_HOLDER":
        if (item.MARKETING_AUTHORIZATION_HOLDER_NAME) {
          values.add(String(item.MARKETING_AUTHORIZATION_HOLDER_NAME));
        }
        break;

      case "MANUFACTURING_SITE":
        if (Array.isArray(item.MANUFACTURING_SITE)) {
          item.MANUFACTURING_SITE.forEach((site) => {
            if (site) {
              values.add(String(site.ORGANIZATION_NAME));
            }
          });
        }
        break;

      default:
        if (item[field]) {
          values.add(String(item[field]));
        }
    }
  });

  const result = [...values].filter((value) => value && value.trim() !== "");

  return result;
};

// Hook untuk menggantikan useGetItemMasterDistinct
export const ItemMasterTable = ({ data, refetch, ...rest }) => {
  const { addStack } = useUIStore();
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    marketingHolders: [],
    manufacturingSites: []
  });

  // Generate Test Id 
  const tableTestId = createTestIdProps(rest["data-testid"] + "_table");

  // Update filter options when data changes
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const countries = getDistinctValues(data, "COUNTRY");
      const marketingHolders = getDistinctValues(data, "MARKETING_AUTHORIZATION_HOLDER");
      const manufacturingSites = getDistinctValues(data, "MANUFACTURING_SITE");

      setFilterOptions({
        countries,
        marketingHolders,
        manufacturingSites
      });
    }
  }, [data]);

  const handleOpenModal = useCallback(
    (data) => {
      const modalDetailTestId = createTestIdProps(rest["data-testid"] + "_modal-detail");
      addStack({
        title: "Edit Mapping API",
        size: "3xl",
        content: <ModalDetailV2 detailData={data} refetch={refetch} {...modalDetailTestId} />,
      });
    },
    [addStack, refetch]
  );

  const actions = useMemo(() => [
    {
      icon: <PencilLine className="" />,
      onClick: (rowData) => handleOpenModal(rowData),
    },
  ], [handleOpenModal]);

  const columns = useMemo(() => [
    {
      id: "#",
      accessorKey: "NUMBER",
      header: "#",
      size: 25,
      cell: ({ row }) => row.index + 1
    },
    {
      id: "Finished Product",
      accessorKey: "ITEM_MASTER_DESCRIPTION",
      header: "Finished Product",
      sort: true,
      filter: "text",
      size: 120,
      cell: ({ row }) => {
        const productName = row.original.ITEM_MASTER_DESCRIPTION;
        return (
          <div className="flex flex-col items-start">
            <span className="text-medium font-medium">{productName}</span>
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
                {`${ingredient.ACTIVE_INGREDIENT}`}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      id: "Country",
      accessorKey: "COUNTRY",
      header: "Country",
      filter: "checkbox",
      option: filterOptions.countries,
      size: 70,
      cell: ({ row }) => {
        const country = row.original.COUNTRY;
        return (
          <div className="flex flex-col items-start">
            <span className="font-medium">{country}</span>
          </div>
        );
      },
    },
    {
      id: "MA Holder",
      accessorKey: "MARKETING_AUTHORIZATION_HOLDER_NAME",
      header: "MA Holder",
      filter: "checkbox",
      option: filterOptions.marketingHolders,
      size: 100,
      cell: ({ row }) => {
        const maHolder = row.original.MARKETING_AUTHORIZATION_HOLDER_NAME;
        return (
          <div className="flex flex-col items-start">
            <span className="font-medium">{maHolder}</span>
          </div>
        );
      },
    },
    {
      id: "Manufacturing Site",
      accessorKey: "MANUFACTURING_SITE",
      header: "Manufacturing Site",
      filter: "checkbox",
      option: filterOptions.manufacturingSites,
      size: 100,
      cell: ({ row }) => {
        const sites = row.original.MANUFACTURING_SITE || [];
        return (
          <ul className="list-disc list-inside">
            {sites.map((site, index) => (
              <li className="font-medium" key={index}>
                {`${site.ORGANIZATION_NAME}`}
              </li>
            ))}
          </ul>
        );
      },
    },
  ], [filterOptions]);


  const memoizedData = useMemo(() => data || [], [data]);

  return (
    <Table
      columns={columns}
      data={memoizedData}
      actions={actions}
      pagination={true}
      searchable={true}
      pageSize={10}
      actionType="button"
      actionVariant="icon"
      {...tableTestId}
    />
  );
};