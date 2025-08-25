import React, { useState, useEffect } from "react";
import { ProductRegistrationDetails } from "./components/ProductRegistrationDetail"; // import komponen baru
import { useGetMarketingAuthorizationDatabaseVersionByDescription } from "../hooks/useMarketingAuthorizationDatabase";
import { Skeleton, Select } from "@/components/Dexain";

export const ProductRegistration = ({ FINISHED_PRODUCT_DESCRIPTION, accessData }) => {
  const { data, isLoading, error } = useGetMarketingAuthorizationDatabaseVersionByDescription(FINISHED_PRODUCT_DESCRIPTION);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const latestVersion = data && data.length > 0 ? Math.max(...data.map((item) => item.VERSION)) : null;

  // Set default selectedVersion ketika data sudah tersedia
  useEffect(() => {
    if (latestVersion !== null) {
      setSelectedVersion(latestVersion);
    }
  }, [latestVersion]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load data</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">No Data Found</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );

  const options = data
    .map((item) => item.VERSION)
    .sort((a, b) => b - a)
    .map((v) => ({
      value: String(v), // Ensure value is always string for consistency
      label: v === 0 ? "0" : (v === latestVersion ? `${v} - Latest` : `${v}`),
    }));

  // Handler to properly convert value back to number for state
  const handleVersionChange = (value) => {
    const numericValue = value === null || value === undefined ? null : Number(value);
    setSelectedVersion(numericValue);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {/* Sticky Full-Width Version Selector */}
        <div className="sticky top-0 z-10 bg-white mb-6">
          <div className="sticky top-0 z-10 bg-white border-b -mt-4 -mx-4">
            <div className="flex flex-row items-center gap-4 bg-gray-200 px-4 w-full">
              <span className="text-md ">Version:</span>
              {!isLoading && !error && Array.isArray(data) && (
                <Select
                  className="h-10 w-[200px] text-md rounded-br-md rounded-tr-md mt-2"
                  placeholder="Select Version..."
                  value={selectedVersion !== null ? String(selectedVersion) : null}
                  onChange={handleVersionChange}
                  options={options}
                />
              )}
            </div>
          </div>
        </div>

        {/* Detail content */}
        <ProductRegistrationDetails version={selectedVersion ?? latestVersion} description={FINISHED_PRODUCT_DESCRIPTION} accessData={accessData} />
      </div>
    </div>
  );
};
