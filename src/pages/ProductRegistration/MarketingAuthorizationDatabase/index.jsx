import { useState, Fragment, useRef, useCallback, useMemo } from "react";
import { RefreshCcw, FileInput, X, Search, ChevronDown } from "lucide-react";
import { Skeleton, Button, Info, Input } from "@/components/Dexain";
import { Filter } from "./components/Filter";
import { NIETable } from "./components/Table";
import { useFile } from "@/hooks/file/useFile";
import { usePostMarketingAuthorizationDatabaseFilter } from "./hooks/useMarketingAuthorizationDatabase";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";

const RegistrationMarketingAuthorizationDatabase = () => {
  const { filteredData } = usePostMarketingAuthorizationDatabaseFilter();
  const { generateExcelFile } = useFile();
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [formState, setFormState] = useState({
    SEARCH_BY: "FINISHED_PRODUCT_DESCRIPTION",
    SEARCH_VALUE: "",
    NIE_MA_HOLDER: "",
    MANUFACTURING_SITE: "",
    COUNTRY: "",
    REGULATORY_PRODUCT_CATEGORY: "",
    REGULATORY_DOSAGE_FORM: "",
    DEVELOPMENT_CATEGORY: "",
  });

  // Memoized search options to prevent recreation on every render
  const searchOptions = useMemo(() => [
    { value: "FINISHED_PRODUCT_DESCRIPTION", label: "Finished Product" },
    { value: "NIE_MA_NO", label: "NIE/MA No" },
    { value: "NIE_MA_HOLDER", label: "MA Holder" },
    { value: "MANUFACTURING_SITE", label: "MFG Site" },
    { value: "COUNTRY", label: "Country" },
    { value: "ACTIVE_INGREDIENT", label: "Active Ingredient" },
  ], []);

  // Memoized selected option to prevent recalculation
  const selectedOption = useMemo(() => {
    return searchOptions.find(opt => opt.value === formState.SEARCH_BY) || searchOptions[0];
  }, [searchOptions, formState.SEARCH_BY]);

  // Helper function to submit data to API with memoization
  const submitToAPI = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Remove empty values from payload
      const payload = {};
      Object.entries(data).forEach(([key, value]) => {
        const isEmpty =
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0);

        if (!isEmpty) {
          payload[key] = Array.isArray(value) && value.length === 1 ? value[0] : value;
        }
      });

      setHasSearched(true);
      const result = await filteredData(payload);
      
      const resultData = result || [];
      setTableData(resultData);
      setHasData(resultData.length > 0);
    } catch (err) {
      setError(err);
      setTableData([]);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  }, [filteredData]);

  // Optimized form state update functions
  const updateFormState = useCallback((field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateFormStateAndSubmit = useCallback((field, value) => {
    const newState = { ...formState, [field]: value };
    setFormState(newState);
    submitToAPI(newState);
  }, [formState, submitToAPI]);

  // Search bar event handlers with memoization
  const handleSelectChange = useCallback((optionValue) => {
    updateFormState("SEARCH_BY", optionValue);
  }, [updateFormState]);

  const handleInputChange = useCallback((e) => {
    updateFormState("SEARCH_VALUE", e.target.value);
  }, [updateFormState]);

  const handleSearchSubmit = useCallback(() => {
    submitToAPI(formState);
  }, [formState, submitToAPI]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitToAPI(formState);
    }
  }, [formState, submitToAPI]);

  const clearSearch = useCallback(() => {
    updateFormState("SEARCH_VALUE", "");
  }, [updateFormState]);

  // Handle form reset
  const handleReset = useCallback((resetState) => {
    setFormState(resetState);
    setHasSearched(false);
    setTableData([]);
    setHasData(false);
  }, []);

  const handleRefresh = useCallback(() => {
    if (hasSearched) {
      submitToAPI(formState);
    }
  }, [hasSearched, formState, submitToAPI]);

  const handleExportExcel = useCallback(() => {
    if (!hasData) {
      alert("No data to export. Please search first.");
      return;
    }

    const date = new Date().toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const customArrayFormatter = (array, key) => {
      return array.join(", ");
    };

    generateExcelFile(
      tableData,
      `marketing-authorized-database-${date}`,
      customArrayFormatter
    );
  }, [hasData, tableData, generateExcelFile]);

  return (
    <Fragment>
      <div className="flex flex-col p-5">
        <div className="flex flex-row items-center justify-between mb-4 pb-4 rounded-md shadow-sm">
         <div>
            <Info
              label="Registration NIE/MA Database"
              labelClassName="font-bold text-black text-xl"
              value={
                <div className="flex items-center gap-1 text-info-normal font-bold">
                  <span className="">Last Update:</span>
                  <span className="">{dayjs().format('DD MMMM YYYY HH:mm:ss')}</span>
                  <RefreshCcw
                    color="#B32017"
                    className="cursor-pointer w-3 h-3"
                    onClick={handleRefresh} 
                    title="Refresh data"
                  />
                </div>
              }
              valueClassName="text-sm font-normal text-info-normal"
            />
          </div>

         <div>
            <Button
              variant="outline"
              icon={<FileInput className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleExportExcel}
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Integrated Search Bar and Filter Container */}
        <div className="flex flex-col">
          <div className="p-4 mb-2 border-b border-tertiary-normal bg-white">
            {/* Search Bar */}
            <div className="border-b border-tertiary-normal bg-white">
              <div className="flex items-center border bg-system-input border-system-divider rounded-md overflow-hidden">
                {/* Search by label */}
                <div className="bg-info-soft text-info-normal text-sm font-semibold px-3 py-4 border-r border-gray-300 whitespace-nowrap">
                  Search by :
                </div>

                {/* Search Type Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 hover:bg-gray-50 focus:outline-none min-w-[200px] justify-between border-r border-gray-300">
                    {selectedOption.label}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]">
                    {searchOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={() => handleSelectChange(option.value)}
                        className={`cursor-pointer hover:bg-primary-soft hover:text-primary-normal ${
                          formState.SEARCH_BY === option.value ? "text-primary-normal" : ""
                        }`}
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
                    placeholder={`Search ${selectedOption.label}...`}
                    value={formState.SEARCH_VALUE || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="border-0 rounded-none shadow-none focus:ring-0 focus:border-0"
                    name="SEARCH_VALUE"
                  />

                  {/* Clear Button */}
                  {formState.SEARCH_VALUE && (
                    <button 
                      type="button" 
                      onClick={clearSearch} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <Button 
                  type="button" 
                  onClick={handleSearchSubmit} 
                  className="bg-primary-normal hover:bg-primary-dark text-white px-3 py-2 border-radius-2 border-0 border-l border-primary-normal mx-1"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Component */}
            <Filter 
              formState={formState} 
              onChange={updateFormStateAndSubmit} 
              setFormState={setFormState} 
              onReset={handleReset} 
            />
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="w-full h-96" />
        ) : error ? (
          <div className="text-red-600 text-center py-8">Failed to load data. Please try again.</div>
        ) : (
          <NIETable data={tableData} />
        )}
      </div>
    </Fragment>
  );
};

export default RegistrationMarketingAuthorizationDatabase;
