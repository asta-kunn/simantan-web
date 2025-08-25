import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import authStore from "@/stores/authStore";
import { CardMenu, Skeleton } from "@/components/Dexain";
import { BannerMenu } from "@/components/common/BannerMenu";
import { useCountTask } from "./hooks/useCountTask";
import {
  NIEMA,
  NewProductRegistration,
  RegRenewal,
  RegVarNotif,
} from "./icons";

const ProductRegistrationHomepage = () => {
  const navigate = useNavigate();
  const { accessibleCard } = authStore((state) => state);
  const { data, isLoading, error } = useCountTask();

  const [showCards, setShowCards] = useState();

  const cards = [
    {
      title: "New Product Registration",
      icon: <img src={NewProductRegistration} alt="new-product-registration" />,
      totalTask: data?.NEW_PRODUCT_REGISTRATION || 0,
      onClick: () => navigate("/product-registration/new"),
    },
    {
      title: "Registration Variation, Notification & Renewal",
      icon: <img src={RegVarNotif} alt="reg-var-notif" />,
      totalTask: data?.REGISTRATION_VARIATION_AND_NOTIFICATION || 0,
      onClick: () => navigate("/product-registration/variation-notification"),
    },
    {
      title: "NIE/MA Database",
      icon: <img src={NIEMA} alt="nie-ma" />,
      totalTask: 0,
      onClick: () =>
        navigate("/product-registration/marketing-authorization-database"),
    },
  ];

  useEffect(() => {
    if (data && !isLoading) {
      const filteredCards = cards.filter((item) => {
        return accessibleCard?.REGISTRATION?.includes(item.title);
      });
      setShowCards(filteredCards);
    }
  }, [data, isLoading, accessibleCard]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
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
      <BannerMenu
        title="Product Registration"
        description="Manage and track product registration requests"
        approvalCount={data?.APPROVAL_LIST || 0}
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
    </>
  );
};

export default ProductRegistrationHomepage;
