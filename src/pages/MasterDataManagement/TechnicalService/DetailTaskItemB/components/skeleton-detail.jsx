import { motion } from 'framer-motion'

const SkeletonDetail = () => {
    return (
        <motion.div
            className="min-h-screen bg-gray-50 p-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <header className="bg-white shadow-sm rounded-md">
                <div className="border-b border-[#D2DEEB] py-4 px-4 bg-plm-grey flex items-center justify-between w-full rounded-t-md">
                    <div className="flex items-center justify-start">
                        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mr-4"></div>
                        <div className="h-8 w-64 bg-slate-200 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </header>
            <main className="bg-white">

                {/* Skeleton untuk konten utama */}
                <div>
                    <div className="px-4 bg-white flex items-center justify-between w-full">
                        <div className="pt-6">
                            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-10 w-80 bg-slate-200 rounded animate-pulse mb-4"></div>
                    </div>
                    <div className="p-4">
                        {/* Skeleton TableAccordionItemB */}
                        <div className="space-y-4">
                            {[1,2,3].map((_, idx) => (
                                <div key={idx} className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                    {/* Skeleton DialogSubmitItemB */}
         
                    {/* Skeleton TableItemAList */}
                    <div className="p-4">
                        <div className="h-8 w-40 bg-slate-200 rounded mb-2 animate-pulse"></div>
                        <div className="space-y-2">
                            {[1,2].map((_, idx) => (
                                <div key={idx} className="h-8 w-full bg-slate-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                    {/* Skeleton FooterItemB */}
                    <div className="flex flex-row items-center justify-between mt-8 p-4">
                        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
                        <div className="flex flex-row gap-2">
                            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    )
}

export default SkeletonDetail
