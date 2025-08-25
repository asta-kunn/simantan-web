import { Button, Select } from "@/components/Dexain"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DialogInactiveManufacture = ({
    isOpen,
    onClose,
    itemFGOption,
    selectedItemFG,
    setSelectedItemFG,
    handleSubmit
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <motion.div 
                        className="fixed inset-0 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        className="relative w-[45vw] bg-white rounded-lg shadow-lg"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button 
                            variant="ghost"
                            className="absolute top-2 right-2 bg-transparent text-black hover:bg-gray-100 rounded-full"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>

                        <div className="p-6">
                            <div className="py-2 border-b border-gray-200 pb-4">
                                <h2 className="text-xl font-semibold">Inactivate Manufacturer</h2>
                                <p className="text-sm text-gray-500 font-medium mt-2">Select finished product and set inactive manufacturer</p>
                            </div>

                            <div className="flex flex-col gap-4 my-8">
                                <Select
                                    label="Finished Product"    
                                    required={true}
                                    searchable={true}
                                    options={itemFGOption}
                                    value={selectedItemFG}
                                    onChange={(value) => { setSelectedItemFG(value) }}
                                />
                            </div>

                            <div className="flex flex-row gap-2 justify-between border-t border-gray-200 pt-4">
                                <Button 
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleSubmit({isOpen: true, item_fg: selectedItemFG})
                                        onClose()
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default DialogInactiveManufacture