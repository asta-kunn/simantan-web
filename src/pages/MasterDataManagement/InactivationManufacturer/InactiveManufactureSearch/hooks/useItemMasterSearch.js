import { useState, useCallback } from "react";
import { usePostItemMasterSearch } from "../../hooks/useItemMaster";
import { DEFAULT_SEARCH_BY } from "../constants/search.constants";

// Helper to safely get data array from response
const extractTableData = (response) => {
  if (!response) return [];
  // Adjust based on API structure
  return response?.data?.data ?? response?.data ?? [];
};

export const useItemMasterSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState(DEFAULT_SEARCH_BY);
  const [tableData, setTableData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tableRenderKey, setTableRenderKey] = useState(0);

  const { searchItemMaster, isLoadingSearch: isLoading, errorSearch: error } = usePostItemMasterSearch();

  const performSearch = useCallback(
    async (value, by = "") => {
      try {
        setIsSearching(true);
        const response = await searchItemMaster({ SEARCH_VALUE: value, SEARCH_BY: by });
        setTableData(extractTableData(response));
      } catch (err) {
        console.error("[useItemMasterSearch] performSearch error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [searchItemMaster]
  );

  const refetchWithNewSearch = useCallback(
    (newSearchValue, newSearchBy = DEFAULT_SEARCH_BY) => {
      if (!newSearchValue || newSearchValue.trim() === "") {
        setTableData([]);
        setIsSearching(false);
        return;
      }

      const trimmedValue = newSearchValue.trim();
      const trimmedBy = newSearchBy.trim();

      setSearchValue(trimmedValue);
      setSearchBy(trimmedBy);

      setTableRenderKey((prev) => prev + 1); // force table remount to reset filters
      performSearch(trimmedValue, trimmedBy);
    },
    [performSearch]
  );

  const refetchCurrentSearch = useCallback(() => {
    console.log("REFETCH CURRENT SEARCH", searchValue, searchBy);
    if (searchValue && searchValue.trim() !== "") {
      performSearch(searchValue, searchBy);
    } else {
      setTableData([]);
    }
  }, [performSearch, searchValue, searchBy]);

  const resetSearchState = useCallback(() => {
    setTableData([]);
    setIsSearching(false);
    setSearchValue("");
    setSearchBy("");
  }, []);

  const handleSearchSubmit = useCallback(
    (value, by = DEFAULT_SEARCH_BY) => {
      if (!value || value.trim() === "") return;

      const trimmedValue = value.trim();
      const trimmedBy = by.trim() || DEFAULT_SEARCH_BY;

      // Avoid redundant search when nothing changes
      if (trimmedValue === searchValue.trim() && trimmedBy === searchBy) {
        performSearch(trimmedValue, trimmedBy);
        return;
      }

      setSearchValue(trimmedValue);
      setSearchBy(trimmedBy);

      performSearch(trimmedValue, trimmedBy);
    },
    [performSearch, searchValue, searchBy]
  );

  return {
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
  };
}; 