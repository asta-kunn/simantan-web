import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button, Select } from "@/components/Dexain";
import { Trash2, Plus } from "lucide-react";
import { createTestIdProps } from "@/lib/utils";

/** Services */
import { getActiveIngredientsMaster } from "@/services/master-data.service";

export const SelectIngredientsField = memo(({ detailData, onChange, ...rest }) => {
  const { control, watch, setValue } = useFormContext();
  const [selectedLabels, setSelectedLabels] = useState({});
  const [allOptions, setAllOptions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ACTIVE_INGREDIENTS",
  });

  const addItemButtonTestId = createTestIdProps(rest["data-testid"] + "_add-item-button");

  const watchedFields = watch("ACTIVE_INGREDIENTS");

  // Create options from detail data
  const existingOptions = useMemo(() => {
    if (!detailData?.ACTIVE_INGREDIENTS) return [];
    return detailData.ACTIVE_INGREDIENTS.map((item) => ({
      value: item.ACTIVE_INGREDIENT_ID,
      label: item.ACTIVE_INGREDIENT,
    }));
  }, [detailData]);

  // Combine existing options with searched options
  const combinedOptions = useMemo(() => {
    const merged = [...existingOptions];
    allOptions.forEach((option) => {
      if (!merged.some((existing) => existing.value === option.value)) {
        merged.push(option);
      }
    });
    return merged;
  }, [existingOptions, allOptions]);

  // Get label for a value from any available source
  const getLabel = useCallback(
    (value) => {
      // Check combined options
      const option = combinedOptions.find((opt) => opt.value === value);
      return option?.label || value;
    },
    [combinedOptions]
  );

  // Initialize data from detailData
  useEffect(() => {
    if (detailData?.ACTIVE_INGREDIENTS && !isInitialized) {
      const initialData = detailData.ACTIVE_INGREDIENTS.map((item) => ({
        value: item.ACTIVE_INGREDIENT_ID,
        isNew: false,
      }));

      const initialLabels = {};
      detailData.ACTIVE_INGREDIENTS.forEach((item, index) => {
        initialLabels[index] = item.ACTIVE_INGREDIENT;
      });

      replace(initialData);
      setSelectedLabels(initialLabels);
      setAllOptions(existingOptions);
      setIsInitialized(true);
    }
  }, [detailData, isInitialized, replace, existingOptions]);

  // Send data to parent component
  useEffect(() => {
    if (onChange && watchedFields && isInitialized) {
      const ingredientsWithLabels = watchedFields
        .filter((field) => field.value) // Remove empty values
        .map((field, index) => ({
          value: field.value,
          label: selectedLabels[index] || getLabel(field.value),
        }));

      onChange(ingredientsWithLabels);
    }
  }, [watchedFields, selectedLabels, onChange, isInitialized, getLabel]);

  // API search handler
  const handleSearch = useCallback(async (query) => {
    // When Select mounts it calls onSearch(""). Return existing options so
    // the control can display prefilled values immediately.
    if (!query) {
      return existingOptions.length ? existingOptions : allOptions;
    }

    try {
      const response = await getActiveIngredientsMaster(query);
      if (response) {
        const searchResults = response.map((item) => ({
          value: item.ACTIVE_INGREDIENT_ID,
          label: item.ACTIVE_INGREDIENT,
        }));

        // Merge with existing options, avoid duplicates
        setAllOptions((prev) => {
          const merged = [...prev];
          searchResults.forEach((newOption) => {
            if (!merged.some((existing) => existing.value === newOption.value)) {
              merged.push(newOption);
            }
          });
          return merged;
        });

        return searchResults;
      }
      return [];
    } catch (error) {
      console.error("Error searching active ingredients:", error);
      return [];
    }
  }, []);

  // Handle ingredient selection
  const handleIngredientChange = useCallback(
    (value, option, index) => {
      const label = option?.label || getLabel(value);

      setSelectedLabels((prev) => ({
        ...prev,
        [index]: label,
      }));

      setValue(`ACTIVE_INGREDIENTS.${index}.value`, value);
    },
    [getLabel, setValue]
  );

  // Handle field removal
  const handleRemove = useCallback(
    (index) => {
      remove(index);

      // Clean up labels by reindexing
      setSelectedLabels((prev) => {
        const newLabels = {};
        Object.entries(prev).forEach(([key, value]) => {
          const originalIndex = parseInt(key);
          if (originalIndex < index) {
            newLabels[originalIndex] = value;
          } else if (originalIndex > index) {
            newLabels[originalIndex - 1] = value;
          }
        });
        return newLabels;
      });
    },
    [remove]
  );

  // Handle adding new field
  const handleAdd = useCallback(() => {
    append({ value: "", isNew: true });
  }, [append]);

  return (
    <>
      <label className="text-base font-medium inline-block mb-1.5 mt-2">Active Ingredients</label>

      <div className="p-4 bg-muted rounded-lg border border-border">
        {fields.map((field, index) => {
          const selectActiveIngredientTestId = createTestIdProps(rest["data-testid"] + "_select-active-ingredient_" + index);
          const removeButtonTestId = createTestIdProps(rest["data-testid"] + "_remove-button_" + index);
          return (
            <div className="grid grid-cols-10 w-full" key={field.id}>
              <div className="col-span-9">
                <Select
                  name={`ACTIVE_INGREDIENTS.${index}.value`}
                  value={field.value}
                  placeholder="Select Active Ingredient"
                  className="flex-1 text-md"
                  options={combinedOptions} // Gunakan combinedOptions untuk semua field
                  onSearch={handleSearch}
                  searchable={true}
                  onChange={(value, option) => handleIngredientChange(value, option, index)}
                  {...selectActiveIngredientTestId}
                />
              </div>

              <div className="col-span-1">
                {fields.length > 1 && (
                  <Button type="button" variant="filled" color="tertiary" className="h-[35px]" onClick={() => handleRemove(index)} {...removeButtonTestId}>
                    <Trash2 size={18} color="red" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <Button type="button" variant="outline" color="primary" size="sm" className="mt-2" icon={<Plus className="size-4" />} onClick={handleAdd} {...addItemButtonTestId}>
          Add More
        </Button>
      </div>
    </>
  );
});

export default SelectIngredientsField;
