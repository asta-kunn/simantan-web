import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Form,
  Select,
  Tabs,
  Timeline,
  WorkflowDiagram,
} from "@/components/Dexain";
import { motion } from "framer-motion";
import { useMutation } from "@/hooks/use-mutation";

import { getWorkflowTemplate } from "@/services/workflow.service";
import { Calendar, ALargeSmall, Paperclip } from "lucide-react";

const masterSubmoduleList = [
  { MODULE: "NPD", SUBMODULE: "New Product Development" },
  {
    MODULE: "EPI",
    SUBMODULE: [
      {
        value: "EXISTING PRODUCT IMPROVEMENT",
        label: "Existing Product Improvement",
      },
    ],
  },
  {
    MODULE: "REGISTRATION",
    SUBMODULE: [
      { value: "NEW PRODUCT REGISTRATION", label: "New Product Registration" },
      {
        value: "REGISTRATION VARIATION AND NOTIFICATION",
        label: "Registration Variation and Notification",
      },
      { value: "REGISTRATION RENEWAL", label: "Registration Renewal" },
    ],
  },
  {
    MODULE: "TERMINATION",
    SUBMODULE: "Product Termination",
  },
  {
    MODULE: "MDM",
    SUBMODULE: [
      { value: "APPROVED VENDOR LIST", label: "Approved Vendor List" },
    ],
  },
];

const renderWorkflowTemplate = () => {
  const workflowTemplateMutation = useMutation(getWorkflowTemplate);

  const [workflowTemplate, setWorkflowTemplate] = useState([]);
  const [submoduleList, setSubmoduleList] = useState([]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setWorkflowTemplate([]);
      const payload = {
        REGISTRATION_TYPE: values.REGISTRATION_TYPE,
        NEED: values.NEED,
      };
      const result = await workflowTemplateMutation.mutate(payload);
      if (result?.success) {
        setWorkflowTemplate(result.data);
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="pt-4">
        <h4 className="text-lg font-bold mb-2">
          Workflow Template Product Registration & Variation
        </h4>
        <Form
          initialValues={{
            REGISTRATION_TYPE: "REGVAR",
            NEED: "AL",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <>
              <div className="flex gap-2">
                {/* <Select
                  label="Module"
                  name="MODULE"
                  options={[
                    { value: "NPD", label: "New Product Development" },
                    { value: "EPI", label: "Existing Product Improvement" },
                    { value: "REGISTRATION", label: "Product Registration" },
                    { value: "TERMINATION", label: "Product Termination" },
                    { value: "MDM", label: "Master Data Management  " },
                  ]}
                  onChange={(value) => {
                    const submoduleList = masterSubmoduleList
                      .filter((item) => item.MODULE === value)
                      .map((item) => item.SUBMODULE);
                    console.log(submoduleList);
                    setSubmoduleList(submoduleList);
                  }}
                />
                <Select
                  label="Sub Module"
                  name="SUB_MODULE"
                  options={submoduleList}
                /> */}
                <Select
                  label="Registration Type"
                  name="REGISTRATION_TYPE"
                  options={[
                    { value: "REGVAR", label: "Registration Variation" },
                    { value: "REGNOTIF", label: "Registation Notification" },
                  ]}
                />
                <Select
                  label="Need"
                  name="NEED"
                  options={[
                    { value: "NIE", label: "Need NIE" },
                    { value: "AL", label: "Need AL" },
                    { value: "PREREG AL", label: "Need Prereg AL" },
                    { value: "PREREG NIE", label: "Need Prereg NIE" },
                  ]}
                />
                <Button
                  className="w-full mt-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Search
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className="mt-6">
          {workflowTemplate.length > 0 ? (
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary-normal to--primary-normal"></div>
              {workflowTemplate.map((item, index) => (
                <motion.div
                  key={item.TASK_CODE}
                  className="flex items-start mb-3 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 z-10">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-primary-normal to--primary-normal rounded-full flex items-center justify-center mr-3 shadow-lg transform transition-all duration-300 hover:scale-110"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.1 + 0.05,
                      }}
                    >
                      <span className="text-white text-sm font-medium">
                        {index + 1}
                      </span>
                    </motion.div>
                  </div>
                  <div className="flex-grow bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="text-lg font-medium text-gray-800">
                        {item.TASK_NAME}
                      </div>
                      {(item.INFORMATION.length > 0 ||
                        item.ATTACHMENT.length > 0) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => {
                            const element = document.getElementById(
                              `details-${item.TASK_CODE}`
                            );
                            if (element) {
                              element.classList.toggle("hidden");
                            }
                          }}
                        >
                          {`Details`}
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Task Action:{" "}
                      {item?.ACTION_LIST.length > 0
                        ? item.ACTION_LIST.join(", ")
                        : "No Action"}
                    </div>
                    {(item.INFORMATION.length > 0 ||
                      item.ATTACHMENT.length > 0) && (
                      <div id={`details-${item.TASK_CODE}`} className="hidden">
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                          {item.INFORMATION.length > 0 && (
                            <div>
                              <div className="mt-2">
                                <h3 className="text-sm font-medium text-gray-800 mb-1">
                                  Information
                                </h3>
                                <div className="text-sm text-gray-600">
                                  {item.INFORMATION.map((info, index) => (
                                    <div key={index} className="mb-1">
                                      <div className="flex items-center">
                                        {info.INFORMATION_TYPE === "DATE" && (
                                          <Calendar className="w-4 h-4 mr-2 text-primary-normal" />
                                        )}
                                        {info.INFORMATION_TYPE === "STRING" && (
                                          <ALargeSmall className="w-4 h-4 mr-2 text-primary-normal" />
                                        )}
                                        <span>{info.INFORMATION_NAME}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {item.ATTACHMENT.length > 0 && (
                            <div>
                              <div className="mt-2">
                                <h3 className="text-sm font-medium text-gray-800 mb-1">
                                  Attachment
                                </h3>
                                <div className="text-sm text-gray-600">
                                  {item.ATTACHMENT.map((info, index) => (
                                    <div key={index} className="mb-1">
                                      <div className="flex items-center">
                                        <Paperclip className="w-4 h-4 mr-2 text-primary-normal" />
                                        <span>{info.ATTACHMENT_NAME}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p
                className="text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                No Workflow Template Found
              </p>
              <p
                className="text-sm text-gray-400 mt-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Please select different criteria
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

const renderWorkflowDiagramSerial = () => {
  return <WorkflowDiagram workflowId={13} />;
};

const renderWorkflowDiagramParallel = () => {
  return <WorkflowDiagram workflowId={1} />;
};

function Joy() {
  return (
    <Tabs
      variant="sticky"
      sticky="top"
      tabs={[
        {
          value: "workflowTemplate",
          label: "Workflow Template",
          content: renderWorkflowTemplate(),
        },
        {
          value: "workflowDiagram",
          label: "Workflow Diagram",
          content: renderWorkflowDiagramSerial(),
        },
        {
          value: "workflowDiagramParallel",
          label: "Workflow Diagram Parallel",
          content: renderWorkflowDiagramParallel(),
        },
      ]}
    />
  );
}
export default Joy;
