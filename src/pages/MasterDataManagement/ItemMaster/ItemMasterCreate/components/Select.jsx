import { memo, useCallback, useState, useEffect, useMemo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button, Select } from "@/components/Dexain";
import { Trash2, Plus } from "lucide-react";

/** Services */
import { getActiveIngredientsMaster } from "@/services/master-data.service";

/** Utils */
import { createTestIdProps } from "@/lib/utils";

export const SelectIngredientsField = memo(({ onChange, ...rest }) => {
  const { control, watch } = useFormContext();
  // State untuk menyimpan selected labels
  const [selectedLabels, setSelectedLabels] = useState({});
  // State untuk menyimpan semua options yang pernah di-search
  const [allOptions, setAllOptions] = useState([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ACTIVE_INGREDIENTS",
  });

  // Watch untuk perubahan pada ACTIVE_INGREDIENTS
  const watchedFields = watch("ACTIVE_INGREDIENTS");

  // Generate Test Id 
  const addItemButtonTestId = createTestIdProps(rest["data-testid"] + "_add-item-button");

  // Helper function untuk mendapatkan label dari value
  const getLabelFromValue = useCallback(
    (value) => {
      const option = allOptions.find((opt) => opt.value === value);
      return option ? option.label : null;
    },
    [allOptions]
  );

  // Effect untuk mengirim perubahan ke parent component
  useEffect(() => {
    if (onChange) {
      const ingredientsWithLabels =
        watchedFields?.map((field, index) => {
          const label = selectedLabels[index];
          if (label) {
            return { value: field.value, label: label };
          }

          // Fallback: cari label dari allOptions
          const option = allOptions.find((opt) => opt.value === field.value);
          return {
            value: field.value,
            label: option?.label || field.value,
          };
        }) || [];

      onChange(ingredientsWithLabels);
    }
  }, [watchedFields, selectedLabels, allOptions, onChange]);

  const handleRemove = useCallback(
    (index) => {
      remove(index);
      // Remove label dari state juga
      setSelectedLabels((prev) => {
        const newLabels = { ...prev };
        delete newLabels[index];
        // Re-index labels yang tersisa
        const reindexedLabels = {};
        Object.keys(newLabels).forEach((key) => {
          const numKey = parseInt(key);
          if (numKey > index) {
            reindexedLabels[numKey - 1] = newLabels[key];
          } else {
            reindexedLabels[key] = newLabels[key];
          }
        });
        return reindexedLabels;
      });
    },
    [remove]
  );

  const handleAdd = useCallback(() => {
    append({ value: "" });
  }, [append]);

  // Memoize API search handler
  const handleActiveIngredientSearch = useCallback(async (query) => {
    try {
      const response = await getActiveIngredientsMaster(query);
      const result = response;
      if (result) {
        const options = result.map((item, index) => ({
          value: item.ACTIVE_INGREDIENT_ID,
          label: item.ACTIVE_INGREDIENT,
        }));

        // Simpan options untuk referensi nanti
        setAllOptions((prev) => {
          const newOptions = [...prev];
          options.forEach((newOption) => {
            if (!newOptions.find((opt) => opt.value === newOption.value)) {
              newOptions.push(newOption);
            }
          });
          return newOptions;
        });

        return options;
      }

      return [];
    } catch (error) {
      console.error("Error searching active ingredients:", error);
      return [];
    }
  }, []);

  // Handler untuk menyimpan label ketika option dipilih
  const handleIngredientChange = useCallback(
    (value, option, index) => {
      const label = option?.label || getLabelFromValue(value) || value;
      setSelectedLabels((prev) => ({
        ...prev,
        [index]: label,
      }));
    },
    [getLabelFromValue]
  );

  return (
    <>
      <label className="text-base font-medium inline-block mb-1.5 mt-2">Active Ingredients <span className="text-primary-normal text-xl">*</span></label>
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
                  onSearch={handleActiveIngredientSearch}
                  searchable={true}
                  onChange={(value, option) => handleIngredientChange(value, option, index)}
                  {...selectActiveIngredientTestId}
                />
              </div>
              <div className="col-span-1">
                {fields.length > 1 && (
                  <Button type="button" variant="outline" color="tertiary" className="h-[35px]" onClick={() => handleRemove(index)} {...removeButtonTestId}>
                    <Trash2 size={18} color="red" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        <Button type="button" variant="outline" color="primary" size="sm" className="mt-2" icon={<Plus className="size-4" />} onClick={handleAdd} {...addItemButtonTestId}>
          Add More
        </Button>
      </div>
    </>
  );
});
