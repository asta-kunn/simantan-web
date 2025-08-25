import { Button, Input } from '@/components/Dexain';
import { SelectInput } from '@/components/form/SelectInput';
import { Label } from '@/components/ui/label';
import { Form, Field, ErrorMessage, Formik } from 'formik';
import { useEffect, useState } from "react";



const CurrentAddress = ({ label, value }) => {
    return (
        <div className="my-1 flex flex-row justify-start gap-4 items-center w-full">
            <div className="w-1/4 text-left text-stone-500 text-lg">{label}</div>
            <div className="w-3/4 text-left text-lg font-semibold">{value}</div>
        </div>
    )
}

const FormEditDrawer = ({ isOpen, onClose, editedItem, setChangeValue, country, loadingCountry, closeSheet }) => {
    const [currentAddress, setCurrentAddress] = useState([
        { label: 'Address 1', value: 'Jl. Imam Bonjol' },
        { label: 'Address 2', value: '-' },
        { label: 'City', value: 'Tangerang' },
        { label: 'Country', value: 'Indonesia' }
    ])

    useEffect(() => {
        setCurrentAddress([
            { label: 'Address 1', value: editedItem.stick_value.address_line1 ?? "-" },
            { label: 'Address 2', value: editedItem.stick_value.address_line2 ?? "-" },
            { label: 'City', value: editedItem.stick_value.city },
            { label: 'Country', value: editedItem.stick_value.country }
        ]);
        console.log(editedItem, 'Edited Item')
    }, [editedItem])


    if (!editedItem) return null

    return (
        <div className="text-center h-screen">
            <div className=" w-full items-center justify-start flex flex-row">
                <p className="text-gray-500 font-semibold text-lg text-left w-1/4">CURRENT ADDRESS</p>
                <div className="border-b border-t border-dashed border-gray-200 w-3/4"></div>
            </div>

            <div className="py-2 flex flex-col justify-start items-start w-full">
                {currentAddress.map((item) => (<CurrentAddress label={item.label} value={item.value} key={item.label} />))}
            </div>

            <div className="w-full items-center justify-start flex flex-row">
                <p className="text-gray-500 font-semibold text-lg text-left w-1/5">NEW ADDRESS</p>
                <div className="border-b border-t border-dashed border-gray-200 w-4/5"></div>
            </div>

            <Formik
                initialValues={{
                    address_line1: editedItem.change_value.address_line1,
                    address_line2: editedItem.change_value.address_line2,
                    postal_code: editedItem.change_value.postal_code,
                    city: editedItem.change_value.city,
                    country: editedItem.change_value.country
                }}
                enableReinitialize={true}
                onSubmit={(values) => {
                    setChangeValue({
                        accordion_id: editedItem.mapping_id.item_id,
                        child_id: editedItem.mapping_id.child_id,
                        subchild_id: editedItem.mapping_id.subchild_id,
                        value: { ...values, isUpdated: true }
                    })
                    onClose(false)
                }}
            >
                {({ handleChange, handleBlur, values, setFieldValue }) => (
                    <Form className="">
                        <div className="py-4">
                            <div className="flex justify-start flex-col py-1 ">
                                <Label className="text-left">Address 1</Label>
                                <Input
                                    id="address_line1"
                                    name="address_line1"
                                    placeholder="Enter your full street address"
                                    className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                    value={values.address_line1}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="address_line1" component="div" className="mt-1 text-sm text-primary-normal-600" />
                            </div>
                            <div className="flex justify-start flex-col py-1">
                                <Label className="text-left">Address 2</Label>
                                <Input
                                    id="address_line2"
                                    name="address_line2"
                                    placeholder="Enter your full street address"
                                    className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                    value={values.address_line2}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="address_line2" component="div" className="mt-1 text-sm text-primary-normal-600" />
                            </div>
                            <div className="flex justify-start flex-row py-1 gap-4">
                                <div className="w-1/3 text-left">
                                    <Label className="text-left">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        name="postal_code"
                                        placeholder="Enter your full street address"
                                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                        value={values.postal_code}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="postal_code" component="div" className="mt-1 text-sm text-primary-normal-600" />
                                </div>
                                <div className="w-2/3 text-left">
                                    <Label className="text-left">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="Enter your full street address"
                                        className="w-full pl-3 pr-3 py-2 rounded-md border-slate-300"
                                        value={values.city}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="city" component="div" className="mt-1 text-sm text-primary-normal-600" />
                                </div>
                            </div>
                            <div className="flex justify-start flex-col py-1 gap-4">
                                <Label className="text-left">Country</Label>
                                <Field
                                    name="country"
                                    className="w-full bg-rose-600"
                                    component={({ field, form }) => (
                                        <SelectInput
                                            {...field}
                                            items={country}
                                            name="country"
                                            changeValue={(e) => {
                                                form.setFieldValue('country', e)
                                            }}
                                            className="w-[30vw]"
                                            loading={loadingCountry}
                                        />
                                    )}
                                />
                                <ErrorMessage name="country" component="div" className="mt-1 text-sm text-primary-normal-600" />
                            </div>
                        </div>

                        <div className="border-t border-stone-200 my-4"></div>

                        <div className="flex items-center flex-row gap-4 justify-between p-4">
                            <Button onClick={closeSheet} className="w-1/8 bg-white text-black border border-stone-100 hover:text-white">Cancel</Button>
                            <Button onClick={closeSheet} type="submit" className="w-1/8 delay-100 transition bg-gradient-to-r from-[#D32F2F] to-[#7F1710] hover:from-[#7F1710] hover:to-[#D32F2F] ">Update</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormEditDrawer;
