import { useState, useEffect } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { createTestIdProps } from "@/lib/utils";
import { Button, Input } from "@/components/Dexain";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  SEARCH_OPTIONS,
  DEFAULT_SEARCH_BY,
} from "../constants/search.constants";


export const SearchBar = ({
  formState,
  onFieldChange,
  onSearch,
  onClear,
  isLoading,
  isSearchDisabled,
  ...rest
}) => {

  // const searchBarTestId = createTestIdProps(rest["data-testid"] + "_search-bar");
  const searchInputTestId = createTestIdProps(rest["data-testid"] + "_search-input");
  const searchButtonTestId = createTestIdProps(rest["data-testid"] + "_search-button");
  const searchDropdownTestId = createTestIdProps(rest["data-testid"] + "_search-dropdown");
  const searchClearButtonTestId = createTestIdProps(rest["data-testid"] + "_search-clear-button");
  const searchDropdownItemTestId = createTestIdProps(rest["data-testid"] + "_search-dropdown-item");
  

  const [selectedValue, setSelectedValue] = useState(
    formState.SEARCH_BY || DEFAULT_SEARCH_BY
  );

  // Sync with parent state changes
  useEffect(() => {
    setSelectedValue(formState.SEARCH_BY || DEFAULT_SEARCH_BY);
  }, [formState.SEARCH_BY]);

  const handleSelectChange = (option) => {
    const value = option?.value || option || DEFAULT_SEARCH_BY;
    setSelectedValue(value);
    onFieldChange("SEARCH_BY", value);
  };

  const handleInputChange = (e) => {
    onFieldChange("SEARCH_VALUE", e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isSearchDisabled) {
        onSearch();
      }
    }
  };

  const getSelectedLabel = () => {
    const selected = SEARCH_OPTIONS.find(
      (option) => option.value === selectedValue
    );
    return selected ? selected.label : "Select field";
  };

  return (
    <div className="p-4 border-tertiary-normal bg-white rounded-md">
      <div className="flex items-center border bg-system-input border-system-divider rounded-md overflow-hidden">
        {/* Search Label */}
        <div className="bg-info-soft text-info-normal text-sm font-semibold px-3 py-4 border-r border-gray-300 whitespace-nowrap">
          Search by :
        </div>

        {/* Search Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 hover:bg-gray-50 focus:outline-none min-w-[200px] justify-between border-r border-gray-300"
            disabled={isLoading}
            {...searchDropdownTestId}
          >
            {getSelectedLabel()}
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
            {SEARCH_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleSelectChange(option)}
                className={`cursor-pointer hover:bg-primary-soft hover:text-primary-normal ${
                  selectedValue === option.value ? "text-primary-normal" : ""
                }`}
                {...searchDropdownItemTestId}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search..."
            name="SEARCH_VALUE"
            value={formState.SEARCH_VALUE || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="border-0 rounded-none shadow-none focus:border-none bg-transparent"
            {...searchInputTestId}
          />

          {/* Clear Button */}
          {formState.SEARCH_VALUE && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isLoading}
              {...searchClearButtonTestId}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={onSearch}
          disabled={isLoading || isSearchDisabled}
          className="bg-primary-normal hover:bg-primary-dark text-white px-3 py-2 border-radius-2 border-0 border-l border-primary-normal mx-1"
          {...searchButtonTestId}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
