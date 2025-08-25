export const SEARCH_OPTIONS = [
  { value: "ITEM_MASTER_DESCRIPTION", label: "Finished Product Description" },
  { value: "ACTIVE_INGREDIENT", label: "Active Ingredient" },
];

export const DEFAULT_SEARCH_BY = "ITEM_MASTER_DESCRIPTION";

export const SEARCH_FORM_INITIAL_STATE = {
  SEARCH_BY: DEFAULT_SEARCH_BY,
  SEARCH_VALUE: "",
}; 