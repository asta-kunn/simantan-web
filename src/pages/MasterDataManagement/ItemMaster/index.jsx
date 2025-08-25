import { useCallback } from "react";
import { Plus } from "lucide-react";
import { Button, Info, Skeleton } from "@/components/Dexain";
import { ItemMasterTable } from "./components/Table";
import { SearchContainer } from "./ItemMasterSearch/index";
import { ModalCreateV2 } from "./ItemMasterCreate/index";
import { useItemMasterSearch } from "./ItemMasterSearch/hooks/useItemMasterSearch";
import { useUIStore } from "@/stores/uiStore";

// Import test ID utilities
import { createTestIdProps } from "@/lib/utils";

const ItemMaster = () => {
  const { addStack } = useUIStore();

  const {
    searchValue,
    tableData,
    isSearching,
    isLoading,
    error,
    refetchWithNewSearch,
    refetchCurrentSearch,
    resetSearchState,
    handleSearchSubmit,
    tableRenderKey,
  } = useItemMasterSearch();

  // Create test ID props
  const tableTestId = createTestIdProps('item-master-data-table');
  const newItemButtonTestId = createTestIdProps('item-master-new-item-button');
  const searchContainerTestId = createTestIdProps('item-master-search-container');
  const newItemModalTestId = createTestIdProps('item-master-new-item-modal');

  const handleOpenModalNewItem = useCallback(() => {
    addStack({
      title: "Add New Mapping API",
      size: "3xl",
      content: (
        <ModalCreateV2
          refetch={refetchCurrentSearch}
          refetchWithNewSearch={refetchWithNewSearch}
          currentSearchValue={searchValue}
          resetSearchState={resetSearchState}
          {...newItemModalTestId}
        />
      ),
    });
  }, [
    addStack,
    refetchCurrentSearch,
    refetchWithNewSearch,
    searchValue,
    resetSearchState,
  ]);

  return (
    <div className="flex flex-col p-5 gap-2">
      {/* Header */}
      <div className="flex flex-row items-center justify-between rounded-md">
        <div>
          <Info
            label="Item Master"
            labelClassName="font-bold text-black text-xl"
            value="Maintain Finished Product Items and Active Pharmaceutical Ingredients"
            valueClassName="text-neutral-gray text-sm font-normal"
          />
        </div>
        <div>
          <Button
            variant="fill"
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
            onClick={handleOpenModalNewItem}
            {...newItemButtonTestId}
          >
            <span className="text-sm text-white font-bold">
              New Mapping API
            </span>
          </Button>
        </div>
      </div>

      {/* Search & Table */}
      <div className="flex flex-col gap-2">
        <SearchContainer
          onSubmit={handleSearchSubmit}
          isLoading={isSearching}
          {...searchContainerTestId}
        />
        <Skeleton className="m-4" isLoading={isLoading}>
          <ItemMasterTable
            key={tableRenderKey}
            data={Array.isArray(tableData) ? tableData : []}
            refetch={refetchCurrentSearch}
            isLoading={isLoading}
            error={error}
            {...tableTestId}
          />
        </Skeleton>
      </div>
    </div>
  );
};

export default ItemMaster;
