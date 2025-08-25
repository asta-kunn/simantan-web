import MenuBanner from "@/assets/images/Menu Banner.webp";
import { motion } from "framer-motion";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { RegApproval } from "@/pages/ProductRegistration/Homepage/icons";
import { userRole } from "@/constants/role.constant";
import authStore from "@/stores/authStore";
import { Badge } from "../Dexain";

export const BannerMenu = memo(({ title, description, approvalCount = 0 }) => {
  const navigate = useNavigate();
  const { user } = authStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 h-[125px] bg-primary-normal text-white relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(46, 125, 50, 0.95), rgba(102, 187, 106, 0.85)), url(${MenuBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-normal-hover/30 to-secondary-normal/30" />
      <div className="relative z-10 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-lg mt-2 text-white/90">{description}</p>
        </motion.div>
        {[
          userRole.RA_MANAGER_INDONESIA,
          userRole.RA_MANAGER_OVERSEAS,
          userRole.RA_SUPPORT_SYSTEM,
        ].includes(user?.ROLE_CODE) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="rounded-md px-3.5 py-7 bg-white hover:bg-gray-100 hover:border-primary-normal transition-all duration-500"
              onClick={() => {
                if([userRole.DSP_MANAGER,userRole.QA_MANAGER,userRole.QA_OFFICER].includes(user?.ROLE_CODE)) {
                  navigate("/master-data-management/list-approval-item-substitution")
                } else {
                  navigate("/product-registration/approval")
                }
              }}
            >
              <img src={RegApproval} alt="logo" className="w-8 h-8" />
              <span className="text-black text-lg font-bold">Approval</span>
              <Badge color="warning" size="sm">
                {approvalCount} Task(s) Waiting for Approval
              </Badge>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});
