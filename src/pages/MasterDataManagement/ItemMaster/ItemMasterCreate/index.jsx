import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUIStore } from "@/stores/uiStore";

/** Components */
import { SelectIngredientsField } from "./components/Select";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { SuccessModal } from "./components/SuccessModal";
import { Button, Select, Form, Info, Divider } from "@/components/Dexain";

/** Validator */
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../schema/item-master.schema";

/** Services */
import { getItemMasterUnmapped } from "@/services/master-data-management/item-master.service";

/** Hooks */
import { useGetCountries, useGetOrganizations } from "@/hooks/master-data/useMasterData";
import { usePostItemMaster } from "../hooks/useItemMaster";

/** Utils */
import { createTestIdProps } from "@/lib/utils";

// Custom hook for form data management
const useFormDataManager = (organizationOptions, countryOptions) => {
  const getLabelByValue = useCallback((options, value) => {
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  }, []);

  const getOrganizationLabel = useCallback((value) =>
    getLabelByValue(organizationOptions, value), [organizationOptions, getLabelByValue]);

  const getCountryLabel = useCallback((value) =>
    getLabelByValue(countryOptions, value), [countryOptions, getLabelByValue]);

  const getManufacturingSiteLabels = useCallback((sites) => {
    if (!sites) return [];
    const siteArray = Array.isArray(sites) ? sites : [sites];
    return siteArray.map(site => getOrganizationLabel(site));
  }, [getOrganizationLabel]);

  return { getOrganizationLabel, getCountryLabel, getManufacturingSiteLabels };
};

export const ModalCreateV2 = memo(({ refetch, refetchWithNewSearch, currentSearchValue, resetSearchState, ...rest }) => {
  const { closeStack, addStack, clearStacks } = useUIStore();
  const { countries, isLoadingCountries } = useGetCountries();
  const { organizations, isLoadingOrganizations } = useGetOrganizations();
  const { postItemMaster, isLoadingPostItemMaster } = usePostItemMaster();
  const [newlyCreatedItem, setNewlyCreatedItem] = useState(null);

  // Generate Test Id 
  const finishedProductTestId = createTestIdProps(rest["data-testid"] + "_finished-product");
  const marketingAuthorizationHolderTestId = createTestIdProps(rest["data-testid"] + "_marketing-authorization-holder");
  const manufacturingSiteTestId = createTestIdProps(rest["data-testid"] + "_manufacturing-site");
  const countryTestId = createTestIdProps(rest["data-testid"] + "_country");
  const activeIngredientsTestId = createTestIdProps(rest["data-testid"] + "_active-ingredients");
  const cancelButtonTestId = createTestIdProps(rest["data-testid"] + "_cancel-button");
  const saveButtonTestId = createTestIdProps(rest["data-testid"] + "_save-button");
  const confirmationModalTestId = createTestIdProps(rest["data-testid"] + "_confirmation-modal");
  const successModalTestId = createTestIdProps(rest["data-testid"] + "_success-modal");
  const confirmationButtonTestId = createTestIdProps(rest["data-testid"] + "_confirmation-button");
  const cancelConfirmationButtonTestId = createTestIdProps(rest["data-testid"] + "_cancel-confirmation-button");
  const backToMasterListButtonTestId = createTestIdProps(rest["data-testid"] + "_back-to-master-list-button");

  // State untuk menyimpan label dari selected options
  const [selectedLabels, setSelectedLabels] = useState({
    ITEM_MASTER_DESCRIPTION: "",
    MARKETING_AUTHORIZATION_HOLDER: "",
    MANUFACTURING_SITE: [],
    COUNTRY: "",
    ACTIVE_INGREDIENTS: [],
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ITEM_MASTER_DESCRIPTION: "",
      MARKETING_AUTHORIZATION_HOLDER: "",
      MANUFACTURING_SITE: [],
      COUNTRY: "",
      ACTIVE_INGREDIENTS: [{ value: "" }],
    },
  });

  // Memoize options to prevent recreation on every render
  const countryOptions = useMemo(() =>
    countries?.map(item => ({
      label: item.COUNTRY_NAME,
      value: item.COUNTRY_NAME,
    })) ?? [], [countries]
  );

  const organizationOptions = useMemo(() =>
    organizations?.map(item => ({
      label: item.ORGANIZATION_NAME,
      value: item.ORGANIZATION_ID,
    })) ?? [], [organizations]
  );

  const { getOrganizationLabel, getCountryLabel, getManufacturingSiteLabels } = useFormDataManager(
    organizationOptions,
    countryOptions
  );

  // Watch manufacturing site changes
  const watchManufacturingSite = methods.watch("MANUFACTURING_SITE");

  useEffect(() => {
    if (watchManufacturingSite) {
      const currentSites = Array.isArray(watchManufacturingSite) ? watchManufacturingSite : [watchManufacturingSite];
      const siteLabels = currentSites.map((siteId) => {
        const option = organizationOptions.find((opt) => opt.value === siteId);
        return option ? option.label : siteId;
      });

      setSelectedLabels((prev) => ({
        ...prev,
        MANUFACTURING_SITE: siteLabels,
      }));
    }
  }, [watchManufacturingSite, organizationOptions]);

  const handleActiveIngredientsChange = useCallback((ingredients) => {
    setSelectedLabels((prev) => ({
      ...prev,
      ACTIVE_INGREDIENTS: ingredients.map((ing) => ing.label || ing.value),
    }));
  }, []);

  // Memoized handlers
  const handleCancel = useCallback(() => {
    closeStack();
  }, [closeStack]);

  const handleClear = useCallback(() => {
    clearStacks();
  }, [clearStacks]);

  const handleItemMasterSearch = useCallback(async (query) => {
    try {
      console.log("[handleItemMasterSearch] query:", query);
      const response = await getItemMasterUnmapped(query);
      const result = response.data.data;
      if (result) {
        return result.map((item, index) => ({
          id: index,
          value: item.ITEM_MASTER_ID,
          label: item.ITEM_MASTER_DESCRIPTION,
          data: item,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }, []);

  // Simplified refetch strategy
  const executeRefetch = useCallback((newItem) => {
    const searchValue = newItem?.ITEM_MASTER_DESCRIPTION || currentSearchValue;

    // Reset search state before refetch
    resetSearchState?.();

    // Execute refetch with appropriate method
    if (searchValue && refetchWithNewSearch) {
      refetchWithNewSearch(searchValue);
    } else {
      refetch?.();
    }
  }, [currentSearchValue, refetchWithNewSearch, refetch, resetSearchState]);

  const handleActualSubmit = useCallback(async (data) => {
    try {
      const response = await postItemMaster(data);
      const newItem = response.data.data;
      setNewlyCreatedItem(newItem);

      // Execute refetch
      executeRefetch(newItem);

      clearStacks();

      // Show success modal
      addStack({
        title: "Successfully Add New Mapping",
        description: "Well done! this item can now be used as a data reference.",
        content: (
          <SuccessModal
            newItemSubmited={newItem}
            onSearchNewItem={() => executeRefetch(newItem)}
          />
        ),
        variant: "success",
        size: "md",
        confirmText: "Close",
        footer: (
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1" {...backToMasterListButtonTestId}>
              Back To Master List
            </Button>
          </div>
        ),
      });
    } catch (error) {
      console.error("API submission error:", error);
      resetSearchState?.();
    }
  }, [postItemMaster, executeRefetch, addStack, clearStacks, handleClear, resetSearchState]);

  const handleSubmitConfirmation = useCallback(async (data) => {
    const payload = {
      ITEM_MASTER_ID: data.ITEM_MASTER_DESCRIPTION,
      ACTIVE_INGREDIENT_ID: [...new Set(data.ACTIVE_INGREDIENTS.map(item => item.value))],
      MANUFACTURING_SITES: data.MANUFACTURING_SITE,
      MARKETING_AUTHORIZATION_HOLDER: data.MARKETING_AUTHORIZATION_HOLDER,
      COUNTRY: data.COUNTRY,
    };

    const confirmationFooter = (
      <div className="flex justify-between gap-2">
        <Button variant="outline" color="tertiary" onClick={handleCancel} {...cancelConfirmationButtonTestId}>
          Cancel
        </Button>
        <Button
          variant="filled"
          color="primary"
          onClick={() => handleActualSubmit(payload)}
          disabled={isLoadingPostItemMaster}
          {...confirmationButtonTestId}
        >
          {isLoadingPostItemMaster ? "Saving..." : "Confirm"}
        </Button>
      </div>
    );

    addStack({
      title: "Save New Mapping ?",
      description: "Please review again because this action cannot be undone.",
      content: <ConfirmationModal selectedLabels={selectedLabels} {...confirmationModalTestId} />,
      variant: "default",
      size: "md",
      footer: confirmationFooter,
    });
  }, [handleActualSubmit, addStack, handleCancel, selectedLabels, isLoadingPostItemMaster]);

  // Optimized item master selection handler
  const handleItemMasterChange = useCallback((value, { data, label }) => {
    const { setValue, clearErrors } = methods;

    // Set form values
    setValue("MARKETING_AUTHORIZATION_HOLDER", data.MARKETING_AUTHORIZATION_HOLDER);
    setValue("MANUFACTURING_SITE", data.MANUFACTURING_SITE);
    setValue("COUNTRY", data.COUNTRY);

    // Clear errors for fields with valid data
    if (data.MARKETING_AUTHORIZATION_HOLDER) clearErrors("MARKETING_AUTHORIZATION_HOLDER");
    if (data.MANUFACTURING_SITE) clearErrors("MANUFACTURING_SITE");
    if (data.COUNTRY) clearErrors("COUNTRY");

    setSelectedLabels((prev) => ({
      ...prev,
      ITEM_MASTER_DESCRIPTION: label || data.ITEM_MASTER_DESCRIPTION,
      MARKETING_AUTHORIZATION_HOLDER: getOrganizationLabel(data.MARKETING_AUTHORIZATION_HOLDER),
      MANUFACTURING_SITE: getManufacturingSiteLabels(data.MANUFACTURING_SITE),
      COUNTRY: getCountryLabel(data.COUNTRY),
    }));
  }, [methods, getOrganizationLabel, getManufacturingSiteLabels, getCountryLabel]);

  return (
    <Form methods={methods} onSubmit={handleSubmitConfirmation}>
      <Select
        name="ITEM_MASTER_DESCRIPTION"
        label="Finished Product"
        className="text-md"
        placeholder="Select Finished Product"
        onSearch={handleItemMasterSearch}
        searchable={true}
        required={true}
        onChange={handleItemMasterChange}
        {...finishedProductTestId}
      />

      <div className="grid grid-cols-2 gap-4 py-4">
        <Select
          name="MARKETING_AUTHORIZATION_HOLDER"
          label="MA Holder"
          className="text-md"
          placeholder="Select MA Holder"
          options={organizationOptions}
          searchable={true}
          required={true}
          disabled={isLoadingOrganizations}
          onChange={(value, option = {}) => {
            setSelectedLabels((prev) => ({
              ...prev,
              MARKETING_AUTHORIZATION_HOLDER: option.label || getOrganizationLabel(value),
            }));
          }}
          {...marketingAuthorizationHolderTestId}
        />

        <Select
          name="MANUFACTURING_SITE"
          label="Manufacturing Site"
          className="text-md"
          placeholder="Select Manufacturing Site"
          options={organizationOptions}
          searchable={true}
          multiple={true}
          required={true}
          disabled={isLoadingOrganizations}
          onChange={(values, selectedOptions) => {
            const labels = selectedOptions?.map((opt) => opt.label) || (Array.isArray(values) ? values.map((val) => getOrganizationLabel(val)) : []);
            setSelectedLabels((prev) => ({
              ...prev,
              MANUFACTURING_SITE: labels,
            }));
          }}
          {...manufacturingSiteTestId}
        />

        <Select
          name="COUNTRY"
          label="Country"
          className="text-md"
          placeholder="Select Country"
          options={countryOptions}
          searchable={true}
          disabled={isLoadingCountries}
          required={true}
          onChange={(value, option = {}) => {
            setSelectedLabels((prev) => ({
              ...prev,
              COUNTRY: option.label || getCountryLabel(value),
            }));
          }}
          {...countryTestId}
        />
      </div>

      <SelectIngredientsField onChange={handleActiveIngredientsChange} {...activeIngredientsTestId} />

      <div className="flex justify-between gap-2 mt-4">
        <Button type="button" variant="outline" color="tertiary" onClick={handleCancel} {...cancelButtonTestId}>
          Cancel
        </Button>
        <Button type="submit" color="primary" disabled={isLoadingPostItemMaster} {...saveButtonTestId}>
          {isLoadingPostItemMaster ? "Saving..." : "Save"}
        </Button>
      </div>
    </Form>
  );
});
