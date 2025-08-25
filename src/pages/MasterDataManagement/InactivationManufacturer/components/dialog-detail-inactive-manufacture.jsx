import { Button } from "@/components/Dexain"
import { Select, DatePicker } from "@/components/Dexain"
import { Loader2, X } from "lucide-react"
import { Controller } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

const DialogDetailInactiveManufacture = ({
    isOpen,
    onClose,
    setIsOpenDetail,
    manufacturer = null,
    handleChangeManufacturer,
    setItemMaterial,
    setInactiveDate,
    detailItemA,
    manufactureList,
    rawmatOptions,
    handleChangeFG,
    loading,
    isView = false,
    control,
    setValue,
    errors,
    handleSubmitSchema,
}) => {

    if (!detailItemA) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <motion.div 
                        className="fixed inset-0 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpenDetail({isOpen: false})}
                    />
                    <motion.div 
                        className="relative w-[55vw] bg-white rounded-lg shadow-lg"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button 
                            variant="ghost"
                            className="absolute top-2 right-2 bg-transparent text-black hover:bg-gray-100 rounded-full"
                            onClick={() => setIsOpenDetail({isOpen: false})}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                        <div className="p-6">
                            <div className="py-2 border-b border-gray-200 pb-4">
                                <h2 className="text-xl font-semibold">Inactive Manufacturer</h2>
                                <p className="text-md text-gray-500 font-medium">
                                    Select finished product and set inactive item and manufacturer.
                                </p>
                            </div>

                            <form onSubmit={handleSubmitSchema}>
                                <div className="flex flex-col gap-6 mb-4">
                                    {/* Finished Product */}
                                    <div>
                                        <label className="text-md font-medium mb-1 block text-gray-900">
                                            Finished Product
                                        </label>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 bg-slate-100 border border-gray-200 rounded-lg p-4">
                                                <div className="flex flex-row justify-between items-start border-b border-gray-200 pb-2">
                                                    <div>
                                                        <div className="font-semibold text-base text-gray-900">{detailItemA['ITEM_FG_NUMBER']}</div>
                                                        <div className="text-md text-gray-700 mb-2">{detailItemA['ITEM_FG_DESC']}</div>
                                                    </div>
                                                    <div>
                                                        {isView ? null : <Button className="h-8 bg-rose-200 text-plm-rose font-semibold hover:bg-plm-rose hover:text-white" onClick={handleChangeFG}>Change</Button>}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-md text-gray-500">Product Version Details (Latest Version)</p>
                                                </div>
                                                <div className="flex flex-row gap-4 items-center justify-start mt-2">
                                                    <div className="w-1/3">
                                                        <p className="font-medium text-md text-gray-500">Recipe Version</p>
                                                        <p className="font-medium text-md text-gray-500">V.{detailItemA['ORA_RECIPE_VERSION']}</p>
                                                    </div>
                                                    <div className="w-1/3">
                                                        <p className="font-medium text-md text-gray-500">Formula Version</p>
                                                        <p className="font-medium text-md text-gray-500">V.{detailItemA['ORA_FORMULA_VERSION']}</p>
                                                    </div>
                                                    <div className="w-1/3">
                                                        <p className="font-medium text-md text-gray-500">AVL Version</p>
                                                        <p className="font-medium text-md text-gray-500">V.{detailItemA['AVL_FORMULA_VERSION']}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Controller
                                                name="manufacturer"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Manufacturer"
                                                        required
                                                        searchable
                                                        options={manufactureList}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(value);
                                                            setValue('itemMaterial', '');
                                                            setValue('inactiveDate', '');
                                                            setItemMaterial('')
                                                            setInactiveDate('')
                                                            handleChangeManufacturer(value);
                                                        }}
                                                        disabled={isView}
                                                        placeholder="Select manufacturer"
                                                    />
                                                )}
                                            />
                                            {errors && errors.manufacturer && <p className="text-sm text-rose-700">{errors.manufacturer.message}</p>}
                                        </div>
                                        <div>
                                            <Controller
                                                name="itemMaterial"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Item Material"
                                                        required
                                                        searchable
                                                        options={rawmatOptions || []}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(value);
                                                            setItemMaterial(value);
                                                        }}
                                                        placeholder="Select item material"
                                                        disabled={!manufacturer || isView}
                                                    />
                                                )}
                                            />
                                            {errors && errors.itemMaterial && <p className="text-sm text-rose-700">{errors.itemMaterial.message}</p>}
                                        </div>
                                        <div>
                                            <Controller
                                                name="inactiveDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        label="Inactive Effective Date"
                                                        required
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(value);
                                                            setInactiveDate(value);
                                                        }}
                                                        disabled={isView}
                                                        placeholder="Select date"
                                                        className="w-full"
                                                    />
                                                )}
                                            />
                                            {errors && errors.inactiveDate && <p className="text-sm text-rose-700">Inactive Effective Date {errors.inactiveDate.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 justify-between border-t border-gray-200 pt-4">
                                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                                    <Button type="submit" className="bg-rose-800 text-white px-8" disabled={loading}>
                                        {loading && (<Loader2 className="w-4 h-4 animate-spin" />)}
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default DialogDetailInactiveManufacture