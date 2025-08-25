import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import authStore from "@/stores/authStore";
import { CardMenu, Skeleton } from "@/components/Dexain";
import { BannerMenu } from "@/components/common/BannerMenu";
import { useCountTaskApprovedVendorList } from "./hooks/useCountTask";

import { FileText, FileCog, FolderSync } from "lucide-react";
import { useCountTaskItemSubstitution } from "./hooks/useCountTaskItemSubtitution";
import Role from "@/pages/Settings/MasterData/Role/index";
import { userRole } from "@/constants/role.constant";

const MasterDataManagementHomepage = () => {
  const navigate = useNavigate();
  const { accessibleCard, user } = authStore((state) => state);
  const {
    totalTaskApprovedVendorList,
    isLoadingApprovedVendorList,
    errorApprovedVendorList,
  } = useCountTaskApprovedVendorList();

  const {
    totalTaskItemSubstitution,
    isLoadingItemSubstitution
  } = useCountTaskItemSubstitution();


  const [showCards, setShowCards] = useState();



  const cards = [
    {
      title: "Approve Vendor List (TS)",
      icon: <FileText className="w-10 h-10" />,
      totalTask: totalTaskApprovedVendorList,
      onClick: () => navigate("/master-data-management/approve-vendor-list"),
    },
    {
      title: "Approve Vendor List (QA)",
      icon: <FileText className="w-10 h-10" />,
      totalTask: totalTaskApprovedVendorList,
      onClick: () => navigate("/master-data-management/approval-qa"),
    },
    {
      title: "Item Master",
      icon: <FileText className="w-10 h-10" />,
      totalTask: 0,
      onClick: () => navigate("/master-data-management/item-master"),
    },
    {
      title: "Item Substitution",
      icon: <FolderSync className="w-10 h-10" />,
      totalTask: totalTaskItemSubstitution,
      onClick: () => {
        if(user.ROLE_CODE === userRole.DSP_OFFICER) {navigate("/master-data-management/item-substitution")}
        else{navigate("/master-data-management/list-approval-item-substitution")}
      },
    },
    {
      title: "Inactivation & Reactivation Manufacturer",
      icon: <FileCog className="w-10 h-10" />,
      totalTask: 0,
      onClick: () => navigate("/master-data-management/inactive-manufacture-list"),
    },
  ];

  useEffect(() => {
    console.log(accessibleCard.MDM, 'CARDS');
    const filteredCards = cards.filter((item) => {
      return accessibleCard?.MDM?.includes(item.title);
    });
    console.log(filteredCards);
    setShowCards(filteredCards);
  }, [isLoadingApprovedVendorList, accessibleCard,isLoadingItemSubstitution]);

  if (errorApprovedVendorList) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Skeleton className="m-4" isLoading={isLoadingApprovedVendorList}>
        <BannerMenu
          title="Master Data Management"
          description="Manage and track master data management requests"
        />
        <motion.div
          className="mx-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {showCards?.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              <CardMenu
                title={card.title}
                onClick={card.onClick}
                icon={card.icon}
                totalTask={card.totalTask}
              />
            </motion.div>
          ))}
        </motion.div>
      </Skeleton>
    </>
  );
};

export default MasterDataManagementHomepage;
