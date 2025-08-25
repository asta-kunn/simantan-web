export const SEARCH_OPTIONS = [
  { value: "MANUFACTURE_CODE", label: "Manufacturer Code" },
  { value: "MANUFACTURE_NAME", label: "Manufacturer Name" },
  { value: "FINISH_PRODUCT", label: "Finished Product" },
  { value: "ITEM_RM_CODE", label: "Material Item Code" },
];

export const DEFAULT_SEARCH_BY = "MANUFACTURE_CODE";

export const SEARCH_FORM_INITIAL_STATE = {
  SEARCH_BY: DEFAULT_SEARCH_BY,
  SEARCH_VALUE: "",
}; 