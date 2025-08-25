import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authStore from "@/stores/authStore";
import { CardMenu } from "@/components/Dexain";
import { BannerMenu } from "@/components/common/BannerMenu";

import { FileText, ShieldX, FolderKanban } from "lucide-react";

const ExistingProductImprovement = () => {
  const navigate = useNavigate();

  const { accessibleCard } = authStore((state) => state);

  const [showCards, setShowCards] = useState([]);

  const existingProductImprovementCards = [
    {
      title: "New Request",
      icon: <FileText className="w-10 h-10" />,
      totalTask: 8,
      onClick: () => navigate("/epi/new-request"),
    },
    {
      title: "Project Management",
      icon: <FolderKanban className="w-10 h-10" />,
      totalTask: 10,
      onClick: () => navigate("/epi/project-management"),
    },
    {
      title: "Project Termination",
      icon: <ShieldX className="w-10 h-10" />,
      totalTask: 4,
      onClick: () => navigate("/epi/project-termination"),
    },
  ];

  useEffect(() => {
    const accessibleCardEPI = accessibleCard?.EPI || [];
    if (accessibleCardEPI.length > 0) {
      const filteredExistingProductImprovementCards =
        existingProductImprovementCards.filter((card) =>
          accessibleCardEPI.includes(card.title)
        );
      setShowCards(filteredExistingProductImprovementCards);
    }
  }, [accessibleCard, navigate]);

  return (
    <>
      <BannerMenu
        title="Existing Product Improvement"
        description="Manage and track existing product improvement requests"
      />

      <div className="container mx-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showCards.map((card, index) => (
          <CardMenu
            key={index}
            title={card.title}
            onClick={card.onClick}
            icon={card.icon}
            totalTask={card.totalTask}
          />
        ))}
      </div>
    </>
  );
};

export default ExistingProductImprovement;
