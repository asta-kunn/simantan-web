import React from 'react'
import Loader from './loader'
import { motion } from "framer-motion";

const LoadingOverlay = ({ loading }) => {
    if (!loading) return null
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[rgba(0,0,0,0.3)] fixed h-screen w-full z-[1000] top-0 left-0"
        >
            <div className="h-screen flex items-center justify-center">
                <Loader loading={loading} />
            </div>
        </motion.div>

    )
}

export default LoadingOverlay
