import { SearchBar } from "./components/Search";
import { useSearchState } from "./hooks/useSearchState";
import { createTestIdProps } from "@/lib/utils";

export const SearchContainer = ({ onSubmit, isLoading, ...rest }) => {
  const {
    formState,
    updateFormField,
    clearSearchValue,
    submitSearch,
    isSearchDisabled,
  } = useSearchState(onSubmit);

  const searchBarTestId = createTestIdProps(rest["data-testid"] + "_search-bar");

  return (
    <div className="flex flex-col">
      <SearchBar
        formState={formState}
        onFieldChange={updateFormField}
        onSearch={submitSearch}
        onClear={clearSearchValue}
        isLoading={isLoading}
        isSearchDisabled={isSearchDisabled()}
        {...searchBarTestId}
      />
    </div>
  );
}; 