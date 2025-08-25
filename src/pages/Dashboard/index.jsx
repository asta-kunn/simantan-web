import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Rocket,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Archive,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stages = [
  {
    key: "idea",
    label: "Product Idea",
    color: "bg-indigo-400",
    icon: <Lightbulb className="w-6 h-6 text-indigo-600" />,
    description:
      "Initial concept and brainstorming for new product opportunities.",
  },
  {
    key: "launch",
    label: "Launch Product",
    color: "bg-blue-400",
    icon: <Rocket className="w-6 h-6 text-blue-600" />,
    description: "Bringing the product to market and initial rollout.",
  },
  {
    key: "registration",
    label: "Registration",
    color: "bg-teal-400",
    icon: <FileText className="w-6 h-6 text-teal-600" />,
    description:
      "Official product registration, compliance, and documentation.",
  },
  {
    key: "discontinual",
    label: "Discontinual",
    color: "bg-gray-300",
    icon: <Archive className="w-6 h-6 text-gray-600" />,
    description: "Product is discontinued and removed from active offerings.",
  },
];

const sampleProducts = [
  {
    id: "P-2001",
    name: "Smart Sensor",
    stage: "launch",
    progress: 60,
    status: "in_progress",
    issues: 1,
  },
  {
    id: "P-2002",
    name: "Industrial Valve",
    stage: "registration",
    progress: 85,
    status: "ok",
    issues: 0,
  },
  {
    id: "P-2003",
    name: "Control Panel",
    stage: "idea",
    progress: 30,
    status: "delayed",
    issues: 2,
  },
  {
    id: "P-2004",
    name: "Hydraulic Pump",
    stage: "discontinual",
    progress: 100,
    status: "ok",
    issues: 0,
  },
];

const statusColors = {
  ok: "text-green-600",
  in_progress: "text-blue-600",
  delayed: "text-rose-600",
};

const statusIcons = {
  ok: <CheckCircle className="w-5 h-5 text-green-600" />,
  in_progress: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
  delayed: <AlertCircle className="w-5 h-5 text-rose-600" />,
};

function StageProgress({ currentStage }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100 rounded-xl -z-10 blur-sm"></div>
      {stages.map((stage, idx) => {
        const isActive = stages.findIndex((s) => s.key === currentStage) >= idx;
        return (
          <React.Fragment key={stage.key}>
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div
                className={`rounded-full p-3 border-2 backdrop-blur-sm ${
                  isActive
                    ? `${stage.color} border-${stage.color.split("-")[1]}-500 shadow-lg shadow-${stage.color.split("-")[1]}-300/50`
                    : "bg-white/80 border-gray-200"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {stage.icon}
              </motion.div>
              <motion.span
                className={`mt-2 text-xs font-medium ${
                  isActive ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {stage.label}
              </motion.span>
            </motion.div>
            {idx < stages.length - 1 && (
              <motion.div
                className={`flex-1 h-1 mx-1 rounded ${
                  isActive ? `${stage.color} opacity-80` : "bg-gray-200"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
              ></motion.div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-indigo-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50/90 text-gray-700 border-b border-gray-200">
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Stage</th>
            <th className="px-4 py-3 text-left">Progress</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Issues</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => {
            const stage = stages.find((s) => s.key === prod.stage);
            return (
              <motion.tr
                key={prod.id}
                className="border-t border-gray-100 hover:bg-gray-50/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.9)" }}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{prod.name}</td>
                <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                  <motion.span
                    className={`w-2 h-2 rounded-full ${stage.color} inline-block`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {stage.label}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`${stage.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${prod.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      ></motion.div>
                    </div>
                    <motion.span 
                      className="text-xs text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.8 }}
                    >
                      {prod.progress}%
                    </motion.span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {statusIcons[prod.status]}
                    <motion.span
                      className={`ml-1 font-medium ${statusColors[prod.status]}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {prod.status.replace("_", " ").toUpperCase()}
                    </motion.span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {prod.issues > 0 ? (
                    <motion.span 
                      className="inline-flex items-center gap-1 text-rose-600 font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        delay: index * 0.1 + 0.5 
                      }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      {prod.issues}
                    </motion.span>
                  ) : (
                    <motion.span 
                      className="text-green-600 font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      0
                    </motion.span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StageDetails({ stageKey }) {
  const stage = stages.find((s) => s.key === stageKey);
  if (!stage) return null;
  return (
    <motion.div 
      className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-indigo-100 mt-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-200/50 to-transparent rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="flex items-center gap-3 mb-2">
        <motion.div 
          className={`rounded-full p-3 ${stage.color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {stage.icon}
        </motion.div>
        <motion.h2 
          className="text-lg font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stage.label}
        </motion.h2>
      </div>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {stage.description}
      </motion.p>
    </motion.div>
  );
}

function StatCard({ icon, title, value, color, trend }) {
  return (
    <motion.div 
      className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} rounded-full blur-3xl opacity-20 -z-10 transform translate-x-1/2 -translate-y-1/2`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className={`w-3 h-3 ${trend > 0 ? 'text-green-600' : 'text-rose-600'} mr-1`} />
              <span className={trend > 0 ? 'text-green-600' : 'text-rose-600'}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [selectedStage, setSelectedStage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 text-gray-800 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-gray-800 mb-2 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Zap className="inline-block mr-2 text-blue-500" />
              Product Lifecycle Dashboard
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Track and manage your manufacturing products from idea to launch,
              registration, and discontinuation.
            </motion.p>
          </motion.header>

          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard 
                icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                title="Total Products" 
                value="42" 
                color="bg-blue-100" 
                trend={8.2}
              />
              <StatCard 
                icon={<Rocket className="w-5 h-5 text-indigo-600" />}
                title="Launch Ready" 
                value="16" 
                color="bg-indigo-100" 
                trend={12.5}
              />
              <StatCard 
                icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
                title="Critical Issues" 
                value="3" 
                color="bg-rose-100" 
                trend={-4.8}
              />
            </div>

            <StageProgress
              currentStage={
                selectedStage ||
                (sampleProducts.length > 0
                  ? sampleProducts[0].stage
                  : stages[0].key)
              }
            />
            <div className="flex flex-wrap gap-4 mb-8">
              {stages.map((stage, idx) => (
                <motion.button
                  key={stage.key}
                  className={`flex-1 min-w-[140px] flex flex-col items-center justify-center p-4 rounded-xl border backdrop-blur-sm transition
                    ${
                      selectedStage === stage.key
                        ? `${stage.color} bg-opacity-30 border-${stage.color.split("-")[1]}-500 shadow-lg shadow-${stage.color.split("-")[1]}-200/50`
                        : "bg-white/70 border-gray-200 hover:bg-white/90"
                    }`}
                  onClick={() => setSelectedStage(stage.key)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderColor: `rgb(var(--${stage.color.split("-")[1]}-500))` 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div 
                    className={`mb-2 ${stage.color}`}
                    whileHover={{ rotate: 10 }}
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    {stage.icon}
                  </motion.div>
                  <span className="font-semibold text-gray-800">
                    {stage.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.h2 
              className="text-xl font-bold mb-4 text-gray-800 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <TrendingUp className="inline-block mr-2 text-blue-500" />
              Products Overview
            </motion.h2>
            <ProductTable
              products={
                selectedStage
                  ? sampleProducts.filter((p) => p.stage === selectedStage)
                  : sampleProducts
              }
            />
          </motion.section>

          <AnimatePresence mode="wait">
            {selectedStage && <StageDetails key={selectedStage} stageKey={selectedStage} />}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
