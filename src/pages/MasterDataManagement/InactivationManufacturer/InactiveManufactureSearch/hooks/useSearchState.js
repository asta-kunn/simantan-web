import { useState, useCallback } from "react";
import { SEARCH_FORM_INITIAL_STATE } from "../constants/search.constants";

export const useSearchState = (onSubmit) => {
  const [formState, setFormState] = useState(SEARCH_FORM_INITIAL_STATE);

  const updateFormField = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const clearSearchValue = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      SEARCH_VALUE: "",
    }));
    onSubmit?.(formState.SEARCH_BY, "");
  }, []);

  const submitSearch = useCallback(() => {
    const searchValue = formState.SEARCH_VALUE?.trim();
    if (!searchValue) return;

    const searchBy = formState.SEARCH_BY || "ITEM_MASTER_DESCRIPTION";

    onSubmit?.(searchValue, searchBy);
  }, [formState.SEARCH_VALUE, formState.SEARCH_BY, onSubmit]);

  const isSearchDisabled = useCallback(() => {
    return !formState.SEARCH_VALUE?.trim();
  }, [formState.SEARCH_VALUE]);

  return {
    formState,
    updateFormField,
    clearSearchValue,
    submitSearch,
    isSearchDisabled,
  };
}; 