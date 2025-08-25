import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Loading from "@/components/common/Loading";

// Combined component map with metadata for dynamic imports
const COMPONENTS = [
  {
    id: "accordion",
    name: "Accordion",
    loader: lazy(() => import("./component/AccordionExample")),
  },
  {
    id: "badge",
    name: "Badge", 
    loader: lazy(() => import("./component/BadgeExample")),
  },
  {
    id: "button",
    name: "Button",
    loader: lazy(() => import("./component/ButtonExample")),
  },
  {
    id: "card",
    name: "Card",
    loader: lazy(() => import("./component/CardExample")),
  },
  {
    id: "form",
    name: "Form",
    loader: lazy(() => import("./component/FormExample")),
  },
  {
    id: "info",
    name: "Info",
    loader: lazy(() => import("./component/InfoExample")),
  },
  {
    id: "input",
    name: "Input",
    loader: lazy(() => import("./component/InputExample")),
  },
  {
    id: "modal",
    name: "Modal",
    loader: lazy(() => import("./component/ModalExample")),
  },
  {
    id: "select",
    name: "Select",
    loader: lazy(() => import("./component/SelectExample")),
  },
  {
    id: "sheet",
    name: "Sheet",
    loader: lazy(() => import("./component/SheetExample")),
  },
  {
    id: "table",
    name: "Table",
    loader: lazy(() => import("./component/TableExample")),
  },
  {
    id: "tabs",
    name: "Tab Bar",
    loader: lazy(() => import("./component/TabsExample")),
  },
  {
    id: "textarea",
    name: "Text Area",
    loader: lazy(() => import("./component/TextAreaExample")),
  },
  {
    id: "stepper",
    name: "Stepper / Timeline",
    loader: lazy(() => import("./component/StepperExample")),
  },
  {
    id: "checkbox",
    name: "Checkbox",
    loader: lazy(() => import("./component/CheckboxExample")),
  },
  {
    id: "uploader",
    name: "Uploader",
    loader: lazy(() => import("./component/UploaderExample")),
  },
  {
    id: "range-picker",
    name: "Range Picker",
    loader: lazy(() => import("./component/RangePickerExample")),
  },
  {
    id: "date-picker",
    name: "Date Picker",
    loader: lazy(() => import("./component/DatePickerExample")),
  },
  {
    id: "divider",
    name: "Divider",
    loader: lazy(() => import("./component/DividerExample")),
  },
  {
    id: "stack",
    name: "Stack (Modals & Alerts)",
    loader: lazy(() => import("./component/StackExample")),
  },
  {
    id: "suggestion-input",
    name: "SuggestionInput",
    loader: lazy(() => import("./component/SuggestionInputExample")),
  },
  {
    id: "text-editor",
    name: "Text Editor",
    loader: lazy(() => import("./component/TextEditorExample")),
  }
];

/**
 * Main component for Component Guidelines
 * Displays all components in alphabetical order with search functionality
 */
const DeveloperDocs = () => {
  const location = useLocation();
  const contentRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  useEffect(() => {
    const allState = location.state;
    console.log({ allState });
  }, []);

  // Filter components based on search term
  const filteredComponents = searchTerm
    ? COMPONENTS.filter((comp) =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMPONENTS;

  // Scroll to section
  const scrollToSection = (sectionId) => {
    setSelectedComponent(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set the first component as selected by default
  useEffect(() => {
    if (filteredComponents.length > 0 && !selectedComponent) {
      setSelectedComponent(filteredComponents[0].id);
    }
  }, [filteredComponents, selectedComponent]);

  // Find the current component
  const currentComponent = COMPONENTS.find(
    (comp) => comp.id === selectedComponent
  );
  const ComponentToRender = currentComponent?.loader;

  return (
    <div className="container mx-auto p-5 relative bg-white rounded-lg shadow-sm">
      <div className="flex">
        <div className="flex-grow pr-4 overflow-y-auto max-h-[calc(100vh-9rem)]" ref={contentRef}>
          {filteredComponents.length > 0 ? (
            <div className="space-y-12">
              {selectedComponent && (
                <div id={selectedComponent} className="component-section">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedComponent}
                      initial={{ opacity: 0.5, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Suspense
                        fallback={
                          <div className="py-8 flex justify-center">
                            <Loading />
                          </div>
                        }
                      >
                        {ComponentToRender && <ComponentToRender />}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                  <div className="border-b border-gray-200 mt-12"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              No components match your search.
            </div>
          )}
        </div>

        {/* Mini map navigation */}
        <div className="w-48 hidden lg:block">
          <div className="sticky top-0 z-10">
            <div className="bg-gray-50 p-3 rounded-md shadow-sm">
              <b className="text-md mb-2 text-gray-700">
                List of Components
              </b>
              
              {/* Search input for minimap */}
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary-normal"
                />
              </div>
              
              <hr className="mb-1" />
              <ul className="space-y-1 text-sm max-h-[calc(100vh-12rem)] overflow-y-auto">
                {filteredComponents.map((comp) => (
                  <li key={comp.id}>
                    <button
                      onClick={() => scrollToSection(comp.id)}
                      className={`text-left hover:text-primary-normal transition-colors w-full truncate ${
                        selectedComponent === comp.id
                          ? "text-primary-normal font-bold"
                          : ""
                      }`}
                    >
                      {comp.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              {filteredComponents.length === 0 && searchTerm && (
                <div className="text-xs text-gray-500 text-center py-2">
                  No components found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDocs;
