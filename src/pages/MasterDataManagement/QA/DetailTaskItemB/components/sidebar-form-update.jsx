import { Button, Input } from '@/components/Dexain';
import { SelectInput } from '@/components/form/SelectInput';
import { Label } from '@/components/ui/label';
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  address_line1: z.string(),
  address_line2: z.string(),
  postal_code: z.string(),
  city: z.string(),
  country: z.string()
});

const SidebarFormUpdate = ({ isOpen, onClose, editedItem, setChangeValue, country, loadingCountry }) => {
    console.log(editedItem?.change_value?.address_line1, 'check Address Line 1')
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address_line1: editedItem?.change_value?.address_line1 ?? '',
            address_line2: editedItem?.change_value?.address_line2 ?? '',
            postal_code: editedItem?.change_value?.postal_code ?? '',
            city: editedItem?.change_value?.city ?? '',
            country: editedItem?.change_value?.country ?? ''
        }
    });

    useEffect(() => {
        form.reset({
            address_line1: editedItem?.change_value?.address_line1 ?? '',
            address_line2: editedItem?.change_value?.address_line2 ?? '',
            postal_code: editedItem?.change_value?.postal_code ?? '',
            city: editedItem?.change_value?.city ?? '',
            country: editedItem?.change_value?.country ?? ''
        });
    }, [editedItem])

    if (!editedItem) return null

    const onSubmit = (values) => {
        setChangeValue({
            accordion_id: editedItem.mapping_id.item_id,
            child_id: editedItem.mapping_id.child_id,
            subchild_id: editedItem.mapping_id.subchild_id,
            manuf_code: editedItem.stick_value.manufacturing_code,
            stick_value: {
                address_line1: editedItem.stick_value.address_line1,
                address_line2: editedItem.stick_value.address_line2,
                postal_code: editedItem.stick_value.postal_code,
                city: editedItem.stick_value.city,
                country: editedItem.stick_value.country
            },
            update_value: {
                ...values
            }
        })
        onClose(false)
    }

    return (
        <div className="text-center">
            <div
                className={`${isOpen ? "z-[10000] fixed inset-0 bg-black bg-opacity-50 transition-opacity" : "none"}`}
                onClick={() => onClose(false)}
            />
            <div
                className={`z-[10001] w-1/2 fixed top-0 right-0 z-40 h-screen  overflow-y-auto transition-transform bg-white dark:bg-gray-800 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-row items-start justify-between p-4">
                    <div>
                        <h2 className="text-xl text-left font-bold text-gray-800">UPDATE - {editedItem.stick_value.manufacturing_code}</h2>
                        <p className="text-gray-500 text-lg text-left">{editedItem.stick_value.manufacturing_source}</p>
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => onClose(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 w-full items-center justify-start flex flex-row">
                    <p className="text-gray-500 font-semibold text-lg text-left w-1/5">Form Address</p>
                    <div className="border-b border-t border-dashed border-gray-200 w-4/5"></div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="p-4">
                        <div className="flex justify-start flex-col py-1 ">
                            <Label className="text-left">Address 1</Label>
                            <Controller
                                control={form.control}
                                name="address_line1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter your full street address"
                                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                    />
                                )}
                            />
                            {form.formState.errors.address_line1 && (
                                <div className="mt-1 text-sm text-primary-normal-600">
                                    {form.formState.errors.address_line1.message}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-start flex-col py-1">
                            <Label className="text-left">Address 2</Label>
                            <Controller
                                control={form.control}
                                name="address_line2"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter your full street address"
                                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                    />
                                )}
                            />
                            {form.formState.errors.address_line2 && (
                                <div className="mt-1 text-sm text-primary-normal-600">
                                    {form.formState.errors.address_line2.message}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-start flex-row py-1 gap-4">
                            <div className="w-1/3 text-left">
                                <Label className="text-left">Postal Code</Label>
                                <Controller
                                    control={form.control}
                                    name="postal_code"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter your full street address"
                                            className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                        />
                                    )}
                                />
                                {form.formState.errors.postal_code && (
                                    <div className="mt-1 text-sm text-primary-normal-600">
                                        {form.formState.errors.postal_code.message}
                                    </div>
                                )}
                            </div>
                            <div className="w-2/3 text-left">
                                <Label className="text-left">City</Label>
                                <Controller
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter your full street address"
                                            className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                        />
                                    )}
                                />
                                {form.formState.errors.city && (
                                    <div className="mt-1 text-sm text-primary-normal-600">
                                        {form.formState.errors.city.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-start flex-col py-1 gap-4">
                            <Label className="text-left">Country</Label>
                            <Controller
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <SelectInput
                                        {...field}
                                        items={country}
                                        changeValue={(e) => form.setValue('country', e)}
                                        className="w-[30vw]"
                                        loading={loadingCountry}
                                    />
                                )}
                            />
                            {form.formState.errors.country && (
                                <div className="mt-1 text-sm text-primary-normal-600">
                                    {form.formState.errors.country.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-stone-200 my-4"></div>

                    <div className="flex items-center flex-row gap-4 justify-between p-4">
                        <Button type="button" onClick={() => onClose(false)} className="w-1/8 bg-white text-black border border-stone-100 hover:text-white">Cancel</Button>
                        <Button type="submit" className="w-1/8 delay-100 transition bg-gradient-to-r from-[#D32F2F] to-[#7F1710] hover:from-[#7F1710] hover:to-[#D32F2F] ">Update</Button>
                    </div>

                </form>

            </div>

        </div>
    );
};

export default SidebarFormUpdate;
