import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const UnderConstructionSVG = ({ variation = false, nie_id = null }) => {
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    if (variation && nie_id === null) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [variation, nie_id]);

  return (
    <div className="flex justify-center flex-col items-center h-[85vh] bg-white">
        <motion.img 
            src={"/under-construction.png"} 
            className="w-72 h-48" 
            alt="Under Construction" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }} 
        />
        <p className="text-2xl font-bold my-2">Under Construction</p>
        {showError && (
          <motion.div 
            className="bg-primary-normal-100 border border-primary-normal-400 text-primary-normal-700 px-4 py-3 rounded mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>Error: Jika variation dipilih, nie_id tidak boleh kosong!</p>
          </motion.div>
        )}
    </div>
  );
};
  
export default UnderConstructionSVG;
  