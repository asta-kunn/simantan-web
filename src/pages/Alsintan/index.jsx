import React from "react";
import { useNavigate } from "react-router-dom";
import { CardMenu } from "@/components/Dexain";
import { BannerMenu } from "@/components/common/BannerMenu";
import { FileText } from "lucide-react";

const AlsintanModule = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Input Laporan APBN",
      icon: <FileText className="w-10 h-10" />,
      onClick: () => navigate("/alsintan/input-apbn"),
    },
    {
      title: "Input Laporan APBD",
      icon: <FileText className="w-10 h-10" />,
      onClick: () => navigate("/alsintan/input-apbd"),
    },
  ];

  return (
    <>
      <BannerMenu
        title="Laporan Pemanfaatan dan Kondisi Alsintan"
        description="Silakan pilih jenis input laporan"
      />
      <div className="container mx-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <CardMenu
            key={idx}
            title={card.title}
            onClick={card.onClick}
            icon={card.icon}
          />
        ))}
      </div>
    </>
  );
};

export default AlsintanModule;


