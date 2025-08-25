

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/Dexain'
import { Button } from '@/components/Dexain'
import { Label } from '@/components/ui/label'
import { SelectInput } from '@/components/Form/SelectInput'
import { forwardRef } from 'react'
import { CountryDropdown } from './country-dropdown'
import { Controller } from 'react-hook-form'


const FormUpdateManufacturer = ({
    currentValue,
    newValue,
    dataCountry,
    closeSheet
}) => {
    const formSchema = z.object({
        address_line1: z.string().min(1, { message: "Address line 1 is required" }),
        address_line2: z.string().min(1, { message: "Address line 2 is required" }).optional(),
        postal_code: z.string().min(1, { message: "Postal code is required" }).optional(),
        city: z.string().min(1, { message: "City is required" }).optional(),
        country: z.string().min(1, { message: "Country is required" }).optional(),
    })

      
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address_line1: newValue.address_line1,
            address_line2: newValue.address_line2,
            postal_code: newValue.postal_code,
            city: newValue.city,
            country: newValue.country,
        }
    })

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <div className="text-center h-screen">
            <div className="w-full items-center justify-start flex flex-row">
                <p className="text-gray-500 font-semibold text-lg text-left w-1/4">CURRENT ADDRESS</p>
                <div className="border-b border-t border-dashed border-gray-200 w-3/4"></div>
            </div>

            <form className="py-4">
                <div className="flex justify-start flex-col py-1">
                    <Label className="text-left">Address 1</Label>
                    <Input
                        readOnly
                        value={currentValue.address_line1}
                        placeholder="Enter your full street address"
                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                    />
                </div>

                <div className="flex justify-start flex-col py-1">
                    <Label className="text-left">Address 2</Label>
                    <Input
                        readOnly
                        value={currentValue.address_line2}
                        placeholder="Enter your full street address"
                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                    />
                </div>

                <div className="flex justify-start flex-row py-1 gap-4">
                    <div className="w-1/3 text-left">
                        <Label className="text-left">Postal Code</Label>
                        <Input
                            readOnly
                            value={currentValue.postal_code}
                            placeholder="Enter your full street address"
                            className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                        />
                    </div>
                    <div className="w-2/3 text-left">
                        <Label className="text-left">City</Label>
                        <Input
                            readOnly
                            value={currentValue.city}
                            placeholder="Enter your full street address"
                            className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                        />
                    </div>
                </div>
                <div className="flex justify-start flex-col py-1 gap-4">
                    <Label className="text-left">Country</Label>
                    <Input
                        readOnly
                        value={currentValue.country}
                        placeholder="Enter your full street address"
                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                    />
                </div>
            </form>

            <div className="w-full items-center justify-start flex flex-row">
                <p className="text-gray-500 font-semibold text-lg text-left w-1/5">NEW ADDRESS</p>
                <div className="border-b border-t border-dashed border-gray-200 w-4/5"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CountryDropdown
                    items={dataCountry || []}
                    placeholder="Select item..."
                    isClearable
                    className="w-1/2"
                />

                {/* <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                        <div>
                            <CountryDropdown
                                {...field}
                                items={dataCountry || []}
                                placeholder="Select item..."
                                isClearable
                                className="w-1/2"
                            />
                        </div>
                    )}
                /> */}

                <button type="submit">Submit</button>
            </form>

        </div>
    )
}

export default FormUpdateManufacturer
