import { motion } from 'framer-motion'

const DetailApprovalSkeleton = () => {
    return (
        <motion.div
          className="p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white shadow-sm rounded-md">
            <div className="border-b border-[#D2DEEB] p-4 bg-plm-grey flex items-center justify-between w-full rounded-t-md">
              <div className="flex items-center justify-start gap-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-white border-l border-b border-r p-4 rounded-b-md">
              <div className="w-full mb-4">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex flex-row gap-2 my-4">
                <div className="w-1/3">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-1/3">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-full border-t border-[#D2DEEB] my-4" />
              <div className="flex flex-row gap-2 my-4 items-start justify-start">
                <div className="w-1/3">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-1/3">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
    
          <motion.div
            className="bg-white border p-4 rounded-md my-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-1/3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-6">
              <div className="w-1/3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>
    
          <motion.div
            className="bg-white border p-4 rounded-md my-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
          </motion.div>
    
          <motion.div
            className="flex flex-row gap-2 my-4 items-start justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-row gap-2 items-start justify-start">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex flex-row gap-2 items-start justify-start">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      );
}

export default DetailApprovalSkeleton
