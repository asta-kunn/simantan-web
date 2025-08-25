import { motion } from 'framer-motion'
import { Fragment, memo } from 'react'
import PopupSection from '../DetailTaskItemB/components/popup-section';

const DetailSection = memo(({
    data,
    handleOpenSheet,
    handleOpenTableHistory,
    mainContent
}) => {
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
                        <div className="flex items-center justify-start">
                            <h1 className="text-lg font-semibold pr-3">
                                Finished Product
                            </h1>
                            <p className="px-4 py-2 ml-4 bg-plm-rose text-white font-600 rounded-full text-lg">
                                {data ? (data['ITEM_FG_NUMBER'] + " - " + data['ITEM_FG_DESC']) : 'A-10101-00 Loading Data...'}
                            </p>
                        </div>
                        <PopupSection detailItemB={data} handleOpenSheet={handleOpenSheet} handleOpenTableHistory={handleOpenTableHistory} />
                    </div>
                </motion.header>
                <motion.main
                    className="bg-white"
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
