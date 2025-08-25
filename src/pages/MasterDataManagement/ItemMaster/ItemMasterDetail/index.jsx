import { memo, useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, createTestIdProps } from "@/lib/utils";

// Components
import { Button, Select, Form, Info, Divider } from "@/components/Dexain";
import { SelectIngredientsField } from "./components/Select";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { SuccessModal } from "./components/SuccessModal";

// Hooks and stores
import { useUIStore } from "@/stores/uiStore";
import { useGetCountries, useGetOrganizations } from "@/hooks/master-data/useMasterData";
import { usePutItemMaster } from "../hooks/useItemMaster";

// Schema
import { schema } from "../schema/item-master.schema";

// Constants
const EMPTY_FORM_VALUES = {
  ITEM_MASTER_DESCRIPTION: "",
  MARKETING_AUTHORIZATION_HOLDER: "",
  MANUFACTURING_SITE: [],
  COUNTRY: "",
  ACTIVE_INGREDIENTS: [{ value: "" }],
};

const INITIAL_LABELS = {
  ITEM_MASTER_DESCRIPTION: "",
  MARKETING_AUTHORIZATION_HOLDER: "",
  MANUFACTURING_SITE: [],
  COUNTRY: "",
  ACTIVE_INGREDIENTS: [],
};

// Custom hooks
const useFormData = (detailData) => {
  return useMemo(() => {
    if (!detailData) return EMPTY_FORM_VALUES;

    return {
      ITEM_MASTER_DESCRIPTION: detailData.ITEM_MASTER_ID || "",
      MARKETING_AUTHORIZATION_HOLDER: detailData.MARKETING_AUTHORIZATION_HOLDER_ID || "",
      MANUFACTURING_SITE: detailData.MANUFACTURING_SITE?.map((site) => site.ORGANIZATION_ID) || [],
      COUNTRY: detailData.COUNTRY || "",
      ACTIVE_INGREDIENTS:
        detailData.ACTIVE_INGREDIENTS?.length > 0
          ? detailData.ACTIVE_INGREDIENTS.map((ingredient) => ({
            value: ingredient.ACTIVE_INGREDIENT_ID,
          }))
          : [{ value: "" }],
    };
  }, [detailData]);
};

const useSelectOptions = (countries, organizations) => {
  const countryOptions = useMemo(() => {
    return (
      countries?.map((item) => ({
        label: item.COUNTRY_NAME,
        value: item.COUNTRY_NAME,
      })) ?? []
    );
  }, [countries]);

  const organizationOptions = useMemo(() => {
    return (
      organizations?.map((item) => ({
        label: item.ORGANIZATION_NAME,
        value: item.ORGANIZATION_ID,
      })) ?? []
    );
  }, [organizations]);

  return { countryOptions, organizationOptions };
};

const useLabelHelpers = (countryOptions, organizationOptions) => {
  const getOrganizationLabel = useCallback(
    (value) => {
      if (!value) return "";
      const option = organizationOptions.find((opt) => opt.value === value);
      return option?.label || value;
    },
    [organizationOptions]
  );

  const getCountryLabel = useCallback(
    (value) => {
      if (!value) return "";
      const option = countryOptions.find((opt) => opt.value === value);
      return option?.label || value;
    },
    [countryOptions]
  );

  const getManufacturingSiteLabels = useCallback(
    (values) => {
      if (!Array.isArray(values)) return [];
      return values.map((value) => getOrganizationLabel(value)).filter(Boolean);
    },
    [getOrganizationLabel]
  );

  return { getOrganizationLabel, getCountryLabel, getManufacturingSiteLabels };
};

// Main component
export const ModalDetailV2 = memo(({ refetch, detailData, ...rest }) => {
  const { closeStack, addStack, clearStacks } = useUIStore();
  const { countries, isLoadingCountries } = useGetCountries();
  const { organizations, isLoadingOrganizations } = useGetOrganizations();
  const { putItemMaster, isLoadingPutItemMaster } = usePutItemMaster();

  // Generate Test Id 
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

  // State
  const [selectedLabels, setSelectedLabels] = useState(INITIAL_LABELS);

  // Refs to prevent unnecessary re-renders
  const isInitializedRef = useRef(false);

  // Custom hooks
  const formData = useFormData(detailData);
  const { countryOptions, organizationOptions } = useSelectOptions(countries, organizations);
  const { getOrganizationLabel, getCountryLabel, getManufacturingSiteLabels } = useLabelHelpers(countryOptions, organizationOptions);

  // Form setup
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const watchManufacturingSite = methods.watch("MANUFACTURING_SITE");

  // Initialize labels when data is ready
  useEffect(() => {
    if (!detailData || !organizations?.length || !countries?.length) return;

    const initialLabels = {
      ITEM_MASTER_DESCRIPTION: detailData.ITEM_MASTER_DESCRIPTION || "No product selected",
      MARKETING_AUTHORIZATION_HOLDER: getOrganizationLabel(detailData.MARKETING_AUTHORIZATION_HOLDER_ID),
      MANUFACTURING_SITE: detailData.MANUFACTURING_SITE?.map((site) => getOrganizationLabel(site.ORGANIZATION_ID)) || [],
      COUNTRY: getCountryLabel(detailData.COUNTRY),
      ACTIVE_INGREDIENTS: detailData.ACTIVE_INGREDIENTS?.map((ing) => ing.ACTIVE_INGREDIENT_NAME) || [],
    };

    setSelectedLabels(initialLabels);
    methods.reset(formData);
    isInitializedRef.current = true;
  }, [detailData, organizations, countries, getOrganizationLabel, getCountryLabel, methods, formData]);

  // Update manufacturing site labels when selection changes
  useEffect(() => {
    if (!isInitializedRef.current || !organizationOptions.length) return;

    const labels = getManufacturingSiteLabels(watchManufacturingSite);
    setSelectedLabels((prev) => ({
      ...prev,
      MANUFACTURING_SITE: labels,
    }));
  }, [watchManufacturingSite, getManufacturingSiteLabels, organizationOptions]);

  // Event handlers
  const handleCancel = useCallback(() => {
    closeStack();
  }, [closeStack]);

  const handleClear = useCallback(() => {
    clearStacks();
  }, [clearStacks]);

  const handleActiveIngredientsChange = useCallback((ingredients) => {
    setSelectedLabels((prev) => ({
      ...prev,
      ACTIVE_INGREDIENTS: ingredients.map((ing) => ing.label || ing.value),
    }));
  }, []);

  const handleMarketingAuthorizationHolderChange = useCallback(
    (value, option = {}) => {
      setSelectedLabels((prev) => ({
        ...prev,
        MARKETING_AUTHORIZATION_HOLDER: option.label || getOrganizationLabel(value),
      }));
    },
    [getOrganizationLabel]
  );

  const handleCountryChange = useCallback(
    (value, option = {}) => {
      setSelectedLabels((prev) => ({
        ...prev,
        COUNTRY: option.label || getCountryLabel(value),
      }));
    },
    [getCountryLabel]
  );

  const handleActualSubmit = useCallback(
    async (payload) => {
      try {
        const response = await putItemMaster(payload);
        const updatedItemMaster = response.data.data;

        refetch();
        clearStacks();

        addStack({
          title: "Successfully Update New Mapping",
          description: "Well done! this item can now be used as a data reference.",
          content: <SuccessModal successData={updatedItemMaster} {...successModalTestId} />,
          variant: "success",
          size: "md",
          confirmText: "Close",
          footer: (
            <div className="flex w-full">
              <Button variant="outline" onClick={handleClear} className="w-full" {...backToMasterListButtonTestId}>
                Back To Master List
              </Button>
            </div>
          ),
        });
      } catch (error) {
        console.error("API submission error:", error);
        // TODO: Add error handling UI
      }
    },
    [putItemMaster, refetch, addStack, clearStacks]
  );

  const handleSubmitConfirmation = useCallback(
    async (data) => {
      const payload = {
        ITEM_MASTER_ID: detailData.ITEM_MASTER_ID,
        ACTIVE_INGREDIENTS: [...new Set(data.ACTIVE_INGREDIENTS.map((item) => item.value))],
        MANUFACTURING_SITES: data.MANUFACTURING_SITE,
        MARKETING_AUTHORIZATION_HOLDER_ID: data.MARKETING_AUTHORIZATION_HOLDER,
        COUNTRY: data.COUNTRY,
      };

      const confirmationFooter = (
        <div className="flex justify-between gap-2">
          <Button variant="outline" color="tertiary" onClick={handleCancel} {...cancelConfirmationButtonTestId}>
            Cancel
          </Button>
          <Button variant="filled" color="primary" onClick={() => handleActualSubmit(payload)} disabled={isLoadingPutItemMaster} {...confirmationButtonTestId}>
            {isLoadingPutItemMaster ? "Updating..." : "Confirm & Update"}
          </Button>
        </div>
      );

      addStack({
        title: "Update New Mapping Data ?",
        description: "Please review again because this action cannot be undone.",
        content: <ConfirmationModal selectedLabels={selectedLabels} {...confirmationModalTestId} />,
        variant: "default",
        size: "md",
        footer: confirmationFooter,
      });
    },
    [handleActualSubmit, addStack, handleCancel, selectedLabels, detailData, isLoadingPutItemMaster]
  );

  // Loading states
  if (!detailData) {
    return <div>Loading...</div>;
  }
  return (
    <Form methods={methods} onSubmit={handleSubmitConfirmation}>
      <div className="flex flex-row items-start gap-x-14 bg-gray-100 p-4 rounded-lg mb-4">
        {/* Bagian Created */}
        <div className="flex flex-row">
          <div className="w-52">
            <Info labelClassName="block text-md text-gray-600" valueClassName="block text-md font-semibold text-gray-900" label="Created By" value={detailData.CREATED_BY || "-"} />
          </div>
          <div className="w-45">
            <Info labelClassName="block text-md text-gray-600" valueClassName="block text-md font-semibold text-gray-900" label="Created Date" value={formatDate(detailData.CREATED_AT, "DD MMMM YYYY") || "-"} />
          </div>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-300 self-stretch" />

        {/* Bagian Modified */}
        <div className="flex flex-row ">
          <div className="w-52">
            <Info labelClassName="block text-md text-gray-600" valueClassName="block text-md font-semibold text-gray-900" label="Modified By" value={detailData.UPDATED_BY || "-"} />
          </div>
          <div className="w-45">
            <Info labelClassName="block text-md text-gray-600" valueClassName="block text-md font-semibold text-gray-900" label="Modified Date" value={formatDate(detailData.UPDATED_AT, "DD MMMM YYYY") || "-"} />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <label className="text-md  inline-block mb-1.5">Finished Product Desc</label>
        <span className="block text-md py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700">{detailData.ITEM_MASTER_DESCRIPTION || "No product selected"}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4">
        <Select
          name="MARKETING_AUTHORIZATION_HOLDER"
          label="NIE/MA Holder"
          className="text-md"
          placeholder="Select MA Holder"
          options={organizationOptions}
          searchable={true}
          disabled={isLoadingOrganizations}
          onChange={handleMarketingAuthorizationHolderChange}
          {...marketingAuthorizationHolderTestId}
        />
        <Select name="MANUFACTURING_SITE" label="Manufacturing Site" className="text-md" placeholder="Select Manufacturing Site" options={organizationOptions} searchable={true} multiple={true} disabled={isLoadingOrganizations} {...manufacturingSiteTestId} />
        <Select name="COUNTRY" label="Country" className="text-md" placeholder="Select Country" options={countryOptions} searchable={true} disabled={isLoadingCountries} onChange={handleCountryChange} {...countryTestId} />
      </div>

      <SelectIngredientsField detailData={detailData} onChange={handleActiveIngredientsChange} {...activeIngredientsTestId} />

      <div className="flex justify-between gap-2 mt-4">
        <Button type="button" variant="outline" color="tertiary" onClick={handleCancel} {...cancelButtonTestId}>
          Cancel
        </Button>
        <Button type="submit" color="primary" disabled={isLoadingPutItemMaster} {...saveButtonTestId}>
          {isLoadingPutItemMaster ? "Updating..." : "Save"}
        </Button>
      </div>
    </Form>
  );
});

ModalDetailV2.displayName = "ModalDetailV2";
