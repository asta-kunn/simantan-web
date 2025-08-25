import { motion } from 'framer-motion'
import { Fragment, memo } from 'react'
import { HistoryIcon } from 'lucide-react'

const DetailSection = memo(({
    data,
    mainContent,
    handleOpenSheet
}) => {

    console.log(data, 'DATA HEADER')
    return (
        <Fragment>
            <div className="min-h-screen bg-gray-50 p-4 mb-12">
                <motion.header
                    className="bg-white shadow-sm rounded-md"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="border-b border-[#D2DEEB] py-2 px-4 bg-plm-grey flex items-center justify-between w-full rounded-t-md">
                        <div className="flex items-center justify-start gap-2">
                            <h1 className="text-lg font-semibold">
                                Finished Product
                            </h1>
                            <p className="px-2 py-1 bg-white font-semibold rounded-full text-lg">
                                {data ? (data['ITEM_FG']) : 'A-10101-00 Loading Data...'}
                            </p>
                        </div>
                        <div className="flex items-center justify-start flex-row">
                            <HistoryIcon
                                size={20}
                                className="text-[#B32017] hover:text-[#B32017]/80 cursor-pointer"
                                onClick={handleOpenSheet}
                            />
                        </div>
                    </div>
                </motion.header>
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    {mainContent}
                </motion.main>
            </div>
        </Fragment>
    )
})

export default DetailSection
