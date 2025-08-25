import { Button } from "@/components/Dexain";
import { Select } from "./SelectSearch";
import { Star } from "lucide-react";

import { useGetMarketingAuthorizationDatabaseDistinct } from "../hooks/useMarketingAuthorizationDatabase";

export const Filter = ({ formState, onChange, setFormState, onReset }) => {
  const { data: productCategoryData } =
    useGetMarketingAuthorizationDatabaseDistinct("REGULATORY_PRODUCT_CATEGORY");
  const { data: dosageFormData } =
    useGetMarketingAuthorizationDatabaseDistinct("REGULATORY_DOSAGE_FORM");
  const { data: countryData } =
    useGetMarketingAuthorizationDatabaseDistinct("COUNTRY");
  const { data: categoryDevelopmentData } =
    useGetMarketingAuthorizationDatabaseDistinct("DEVELOPMENT_CATEGORY");
  const { data: marketingAuthorHolderData } =
    useGetMarketingAuthorizationDatabaseDistinct("NIE_MA_HOLDER");
  const { data: manufacturingSiteData } =
    useGetMarketingAuthorizationDatabaseDistinct("MANUFACTURING_SITE");

  // convert data to options format
  const convertToOptions = (data) => {
    return data.map((item) => ({
      value: item,
      label: item,
    }));
  };

  const resetForm = () => {
    const defaultState = {
      SEARCH_BY: "FINISHED_PRODUCT_DESCRIPTION",
      SEARCH_VALUE: "",
      REGULATORY_PRODUCT_CATEGORY: "",
      NIE_MA_HOLDER: "",
      REGULATORY_DOSAGE_FORM: "",
      COUNTRY: "",
      DEVELOPMENT_CATEGORY: "",
      MANUFACTURING_SITE: "",
    };

    setFormState(defaultState);
    onReset?.(defaultState); // 🔁 Trigger fetch ulang dengan nilai default
  };

  const optionsProductCategory = convertToOptions(productCategoryData || []);
  const optionsDosageForm = convertToOptions(dosageFormData || []);
  const optionsCountry = convertToOptions(countryData || []);
  const optionsDevelopmentCategory = convertToOptions(categoryDevelopmentData || []);
  const optionsMAHolder = convertToOptions(marketingAuthorHolderData || []);
  const optionsManufacturingSite = convertToOptions(manufacturingSiteData || []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full mt-2">
      <Select
        name="MA Holder"
        placeholder="NIE/MA Holder"
        searchable={true}
        multiple={true}
        options={optionsMAHolder}
        value={formState.NIE_MA_HOLDER}
        onChange={(v) => onChange("NIE_MA_HOLDER", v)}
      />
      <Select
        name="MFG Site"
        placeholder="MFG Site"
        searchable={true}
        multiple={true}
        options={optionsManufacturingSite}
        value={formState.MANUFACTURING_SITE}
        onChange={(v) => onChange("MANUFACTURING_SITE", v)}
      />
      <Select
        name="Country"
        placeholder="Country"
        searchable={true}
        multiple={true}
        options={optionsCountry}
        value={formState.COUNTRY}
        onChange={(v) => onChange("COUNTRY", v)}
      />
      <Select
        name="Product Category"
        placeholder="Product Category"
        searchable={true}
        multiple={true}
        options={optionsProductCategory}
        value={formState.REGULATORY_PRODUCT_CATEGORY}
        onChange={(v) => onChange("REGULATORY_PRODUCT_CATEGORY", v)}
      />
      <Select
        name="Dosage Form"
        placeholder="Dosage Form"
        searchable={true}
        multiple={true}
        options={optionsDosageForm}
        value={formState.REGULATORY_DOSAGE_FORM}
        onChange={(v) => onChange("REGULATORY_DOSAGE_FORM", v)}
      />
      <Select
        name="Development Category"
        placeholder="Dev Category"
        searchable={true}
        multiple={true}
        options={optionsDevelopmentCategory}
        value={formState.DEVELOPMENT_CATEGORY}
        onChange={(v) => onChange("DEVELOPMENT_CATEGORY", v)}
      />
      <Button
        className="w-100 h-inherit"
        variant="soft"
        color="primary"
        onClick={resetForm}
      >
        Reset
      </Button>
    </div>
  );
};
