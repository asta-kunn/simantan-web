import React, { Fragment } from 'react'
import { Form, Field, ErrorMessage } from 'formik';
import { SelectInput } from '@/components/form/SelectInput';

const ProductInformationForm = ({ saveAsDraft }) => {
    const items = [
        {
            value: "next.js",
            label: "Next.js",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ]

    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage Form <span className="text-primary-normal-500">*</span>
                    </label>
                    <Field
                        name="dosageForm"
                        className="w-full bg-rose-600"
                        component={({ field, form }) => (
                            <SelectInput
                                {...field}
                                items={items}
                                changeValue={(value) => {
                                    form.setFieldValue(field.name, value);
                                }}
                                className="w-[30vw]"
                            />
                        )}
                    />
                    <ErrorMessage name="dosageForm" component="div" className="mt-1 text-sm text-primary-normal-600" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit of Meassure <span className="text-primary-normal-500">*</span>
                    </label>
                    <Field
                        name="unitOfMeassure"
                        className="w-full bg-rose-600"
                        component={({ field, form }) => (
                            <SelectInput
                                {...field}
                                items={items}
                                changeValue={(value) => {
                                    form.setFieldValue(field.name, value);
                                }}
                                className="w-[30vw]"
                            />
                        )}
                    />
                    <ErrorMessage name="unitOfMeassure" component="div" className="mt-1 text-sm text-primary-normal-600" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Strength <span className="text-primary-normal-500">*</span>
                    </label>
                    <Field
                        name="strength"
                        className="w-full bg-rose-600"
                        component={({ field, form }) => (
                            <SelectInput
                                {...field}
                                items={items}
                                changeValue={(value) => {
                                    form.setFieldValue(field.name, value);
                                }}
                                className="w-[30vw]"
                            />
                        )}
                    />
                    <ErrorMessage name="strength" component="div" className="mt-1 text-sm text-primary-normal-600" />
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
                <button
                    type="button"
                    onClick={saveAsDraft}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-primary-normal-600 bg-white"
                >
                    Save as Draft
                </button>
                <button
                    type="submit"
                    className="bg-[#0B75BE] px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none "
                >
                    Continue
                </button>
            </div>
        </Fragment>
    )
}

export default ProductInformationForm
