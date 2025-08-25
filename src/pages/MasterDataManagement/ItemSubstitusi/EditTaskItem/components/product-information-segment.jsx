import { Card } from '@/components/Dexain'
import { Select } from '@/components/Dexain'
import { Controller } from 'react-hook-form'
import { RadioButton } from '@/components/Dexain'
import { DatePicker } from '@/components/Dexain'
import { TextArea } from '@/components/Dexain'
import { GROUP_RADIO, GROUP_RADIO_MI } from '../constants/group-lov'
import { Label } from '@/components/ui/label'

const ProductInformationSegment = ({
    errors,
    control,
    itemProductList,
    productName,
    formulaList,
    versionList,
    formula,
    isMIChanged
}) => {

    return (
        <Card
            key={"SECONDARY_KEY"}
            title="Product Information"
            description="Enter the details product that requires a substitution item."
        >
            <div className="space-y-2 w-1/2">
                <Label className="text-sm font-bold">
                    Product Name <span className="text-rose-500">*</span>
                </Label>
                <Controller
                    name="productName"
                    control={control}
                    render={({ field }) => (
                        <Select
                            searchable={true}
                            options={itemProductList}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <span className="text-xs text-stone-400">cth: A-10001-00 Stimuno</span>
                {errors.productName && (
                    <p className="text-sm text-rose-500">{errors.productName.message}</p>
                )}
            </div>


            <div className="flex flex-row gap-4 mt-4">
                <div className="space-y-2 w-1/2">
                    <Label className="text-sm font-bold">
                        Formula <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="formula"
                        control={control}
                        render={({ field }) => (
                            <Select
                                disabled={!productName}
                                searchable={true}
                                placeholder="Select formula"
                                options={formulaList}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.formula && (
                        <p className="text-sm text-rose-500">{errors.formula.message}</p>
                    )}
                </div>
                <div className="space-y-2 w-1/2">
                    <Label className="text-sm font-bold">
                        Version <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="version"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select version"
                                disabled={!formula}
                                searchable={false}
                                options={versionList}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.version && (
                        <p className="text-sm text-rose-500">{errors.version.message}</p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-300 my-4" />

            <div className="flex flex-row gap-4">
                <div className="space-y-2 w-1/2">
                    <Label className="text-sm font-bold">
                        Serialization Implementation Status (Authentication) <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="serializationStatus"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-col gap-2">
                                {GROUP_RADIO.map((item, index) => (
                                    <RadioButton
                                        key={index}
                                        value={item.value}
                                        label={item.label}
                                        checked={field.value === item.value}
                                        onChange={() => field.onChange(item.value)}
                                    />
                                ))}
                            </div>
                        )}
                    />
                    {errors.serializationStatus && (
                        <p className="text-sm text-rose-500">{errors.serializationStatus.message}</p>
                    )}
                </div>

                <div className="space-y-2 w-1/2">
                    <Label className="text-sm font-bold">
                        Serialization Due Date (Authentication) <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="serializationDate"
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
                    {errors.serializationDate && (
                        <p className="text-sm text-rose-500">{errors.serializationDate.message}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2 w-1/2">
                    <Label className="text-sm font-bold">
                        Are there any changes effecting MI ? <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                        name="isMIChanged"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-row gap-2">
                                {GROUP_RADIO_MI.map((item, index) => (
                                    <RadioButton
                                        key={index}
                                        value={item.value}
                                        label={item.label}
                                        checked={field.value === item.value}
                                        onChange={() => field.onChange(item.value)}
                                    />
                                ))}
                            </div>
                        )}
                    />
                    {errors.isMIChanged && (
                        <p className="text-sm text-rose-500">{errors.isMIChanged.message}</p>
                    )}
                </div>

                <div className="space-y-2 w-full">
                    <Controller
                        name="serializationNotes"
                        control={control}
                        render={({ field }) => {
                            return (
                                <TextArea
                                    placeholder="Additional notes for detail changes."
                                    rows={2}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isMIChanged !== 'Y'}
                                />
                            );
                        }}
                    />
                    {errors.serializationNotes && (
                        <p className="text-sm text-rose-500">{errors.serializationNotes.message}</p>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default ProductInformationSegment
