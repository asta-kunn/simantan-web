import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Card, Button, Input, Divider, Tabs } from "@/components/Dexain";
import { UserIcon, MenuIcon } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const masterDataItems = [
  {
    title: "Position Code to Department and Roles",
    description: "Mapping position code from Kappabel to Role and Department, so user that have position code can have role and department on login to the system",
    icon: <UserIcon />,
    path: "/settings/master-data/position-code/department-role",
  },
  {
    title: "Role",
    description: "Role Management",
    icon: <UserIcon />,
    path: "/settings/master-data/role",
  },
  {
    title: "Menu",
    description: "Menu Management",
    icon: <MenuIcon />,
    path: "/settings/master-data/menu",
  },
  {
    title: "Responsibilities",
    description: "Reponsibilities Management",
    icon: <UserIcon />,
    path: "/settings/master-data/responsibilities",
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  // State for search in each tab (expandable for more tabs)
  const [search, setSearch] = useState({
    "master-data": "",
    // Add more keys for other tabs if needed
  });

  // Filtered items for master data tab
  const filteredMasterData = masterDataItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search["master-data"].toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search["master-data"].toLowerCase())
  );

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Tabs
        tabs={[
          {
            label: "Master Data",
            value: "master-data",
            content: (
              <div>
                <div className="mb-3">
                  <Input
                    className="w-full bg-white focus:border-1"
                    placeholder="Search Master Data..."
                    value={search["master-data"]}
                    onChange={(e) =>
                      setSearch((prev) => ({
                        ...prev,
                        "master-data": e.target.value,
                      }))
                    }
                  />
                </div>
                {filteredMasterData.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    No results found.
                  </div>
                ) : (
                  filteredMasterData.map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary-normal hover:shadow-sm transition-all duration-200 flex items-center justify-between mb-2 cursor-pointer group"
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                      }}
                      onClick={() => {
                        navigate(item.path);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        {/* Left: Icon, Title, Description */}
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center justify-center text-xl mt-1">
                            {item.icon}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary-normal transition-all duration-200">
                              {item.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {/* Right: Arrow */}
                        <span className="ml-6 text-gray-300 group-hover:text-primary-normal transition-all duration-200 text-xl flex-shrink-0">
                          &#8594;
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ),
          },
        ]}
      />
    </motion.div>
  );
};

export default SettingsPage;
