import { Card } from '@/components/Dexain'
import { Controller } from 'react-hook-form'
import { Select } from '@/components/Dexain'
import { ArrowRight } from 'lucide-react'
import { Trash2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/Dexain'
import { TextArea } from '@/components/Dexain'
import { Button } from '@/components/Dexain'
import { Label } from '@/components/ui/label'

const ItemReplacementSegment = ({ fields, control, errors, append, remove, uomList, originalItemList, itemSubstitutionList }) => {
    return (
        <Card
            key={"THIRD_KEY"}
            title="Item Replacement"
            description="Select replacement item and specify the validity period."
        >
            <div className="mb-4">
                <div className="grid grid-cols-12 gap-4 bg-slate-100 p-4 rounded-md border border-slate-300">
                    <div className="col-span-5">
                        {fields.map((field, index) => (
                            <div key={field.id} className="w-full flex flex-row items-start justify-start space-x-2">
                                <div className="w-1/2 space-y-2">
                                    <Label className="text-sm font-bold">
                                        Original Item <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.originalItem`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                searchable={true}
                                                options={originalItemList}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.originalItem && (
                                        <p className="text-sm text-rose-500">{errors.items[index].originalItem.message}</p>
                                    )}
                                </div>
                                <div className="w-1/4 space-y-2">
                                    <Label className="text-sm font-bold">
                                        Qty <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.originalQty`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                className="w-full bg-white"
                                                type="number"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.originalQty && (
                                        <p className="text-sm text-rose-500">{errors.items[index].originalQty.message}</p>
                                    )}
                                </div>
                                <div className="w-1/4 space-y-2">
                                    <Label className="text-sm font-bold">
                                        UoM <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.originalUom`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                searchable={true}
                                                options={uomList}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.originalUom && (
                                        <p className="text-sm text-rose-500">{errors.items[index].originalUom.message}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`flex items-center justify-center ${fields.length > 1 ? "" : "col-span-2"}`}>
                        <ArrowRight className="text-blue-600" size={30} />
                    </div>
                    <div className={`${fields.length > 1 ? "col-span-6" : "col-span-5"}`}>
                        {fields.map((field, index) => (
                            <div key={field.id} className="w-full flex flex-row items-start justify-start space-x-2">
                                <div className="w-1/2 space-y-2">
                                    <Label className="text-sm font-bold">
                                        Replacement Item <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.replacementItem`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                searchable={true}
                                                options={itemSubstitutionList}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.replacementItem && (
                                        <p className="text-sm text-rose-500">{errors.items[index].replacementItem.message}</p>
                                    )}
                                </div>
                                <div className="w-1/4 space-y-2">
                                    <Label className="text-sm font-bold">
                                        Qty <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.replacementQty`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                className="w-full bg-white"
                                                type="number"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.replacementQty && (
                                        <p className="text-sm text-rose-500">{errors.items[index].replacementQty.message}</p>
                                    )}
                                </div>
                                <div className="w-1/4 space-y-2">
                                    <Label className="text-sm font-bold">
                                        UoM <span className="text-rose-500">*</span>
                                    </Label>
                                    <Controller
                                        name={`items.${index}.replacementUom`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                searchable={true}
                                                options={uomList}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.items?.[index]?.replacementUom && (
                                        <p className="text-sm text-rose-500">{errors.items[index].replacementUom.message}</p>
                                    )}
                                </div>
                                <div className="mt-9">
                                    {fields.length > 1 && (<Trash2 className="text-rose-500" onClick={() => { remove(index) }} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Button
                type="button"
                className="mt-4"
                variant="outline"
                icon={<Plus />}
                onClick={() => append({
                    originalItem: "",
                    originalQty: "",
                    originalUom: "",
                    replacementItem: "",
                    replacementQty: "",
                    replacementUom: ""
                })}
            >
                Tambah Item
            </Button>



            <div className="flex flex-row gap-8 mt-6">
                <div className="w-1/2">
                    <Label className="text-sm font-bold">
                        Valid From <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="validFrom"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                caption="Format: DD MMMM YYYY"
                                minDate={new Date(2000, 0, 1)}
                                maxDate={new Date(2030, 11, 31)}
                                value={field.value}
                                onChange={field.onChange}
                                format="D MMMM YYYY"
                            />
                        )}
                    />
                    {errors.validFrom && (
                        <p className="text-sm text-rose-500">{errors.validFrom.message}</p>
                    )}
                </div>
                <div className="w-1/2">
                    <Label className="text-sm font-bold">
                        Valid To <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="validTo"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                caption="Format: DD MMMM YYYY"
                                minDate={new Date(2000, 0, 1)}
                                maxDate={new Date(2030, 11, 31)}
                                value={field.value}
                                onChange={field.onChange}
                                format="D MMMM YYYY"
                            />
                        )}
                    />
                    {errors.validTo && (
                        <p className="text-sm text-rose-500">{errors.validTo.message}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-row gap-8 mt-6">
                <div className="w-1/2 pr-4">
                    <Label className="text-sm font-bold">
                        Reference No <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="referenceNo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                className="w-full bg-white"
                                type="text"
                                placeholder="Enter Reference No"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.referenceNo && (
                        <p className="text-sm text-rose-500">{errors.referenceNo.message}</p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-300 my-4" />

            <div className="space-y-2 w-full">
                <Label className="text-sm font-bold">
                    Notes
                </Label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => {
                        const isMIChangedValue = control._formValues?.isMIChanged;
                        const isDisabled = isMIChangedValue === "2";
                        return (
                            <TextArea
                                placeholder="Additial notes for detail changes."
                                rows={2}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isDisabled}
                            />
                        );
                    }}
                />
            </div>

        </Card>
    )
}

export default ItemReplacementSegment
