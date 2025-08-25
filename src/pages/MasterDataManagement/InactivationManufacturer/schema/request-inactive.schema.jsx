import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const useRequestInactiveSchema = ({ manufacturer, itemMaterial, inactiveDate, handleInsert }) => {
  const schema = z.object({
    manufacturer: z.string().nonempty("Manufacturer is required"),
    itemMaterial: z.string().nonempty("Item Material is required"),
    inactiveDate: z.preprocess(
      (val) => (val ? new Date(val) : undefined), // convert value ke Date
      z.date({
        required_error: "Inactive date is required",
        invalid_type_error: "Invalid date",
      })
    ),
  });

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      manufacturer: manufacturer || '',
      itemMaterial: itemMaterial || '',
      inactiveDate: inactiveDate || undefined,
    },
  });

  const onSubmit = async (data) => {
    await handleInsert(data)
  }

  return {
    control,
    setValue,
    handleSubmitSchema: handleSubmit,
    reset,
    errors,
    onSubmit
  };
};

export default useRequestInactiveSchema;
