import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import MainCard from "@/components/common/MainCard";
import { Button } from "@/components/Dexain";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductSelectionCard from "./components/ProductSelectionCard";
import EvidenceCard from "./components/EvidenceCard";
import SummaryCard from "./components/SummaryCard";

const PackagingDesignForm = ({ state }) => {
  // Get route parameters and state
  const { subCategory } = useParams();
  const location = useLocation();
  const routeState = state || location.state || {};

  useEffect(() => {
    console.log("PackagingDesignForm component loaded");
    console.log("Props state:", state);
    console.log("Location state:", location.state);
    console.log("Route state (combined):", routeState);
  }, [state, location.state, routeState]);

  // State to track the current step (0 = ProductSelectionCard, 1 = EvidenceCard, 2 = SummaryCard)
  const [currentStep, setCurrentStep] = useState(0);

  // State to store selected items
  const [selectedItems, setSelectedItems] = useState({});

  // State to store selected products
  const [selectedProducts, setSelectedProducts] = useState([]);

  // State for product selection dropdown
  const [currentProductSelection, setCurrentProductSelection] = useState("");

  // States for EvidenceCard data
  const [editorContent, setEditorContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [proposedChangeContent, setProposedChangeContent] = useState("");
  const [proposedChangeFiles, setProposedChangeFiles] = useState([]);
  const [changeReasonContent, setChangeReasonContent] = useState("");
  const [changeReasonFiles, setChangeReasonFiles] = useState([]);

  // Store category information from route state
  const [requestData, setRequestData] = useState({
    category: routeState.category || "Unknown Category",
    subCategory: routeState.subCategory || "Unknown Sub-Category",
    title: routeState.title || "Unknown Title",
  });

  // Sample data for all available products
  const allProductOptions = [
    "A-1234-00 Candesartan 8mg",
    "A-1235-00 Candesartan 16mg",
    "B-5678-00 Paracetamol 500mg",
    "C-9101-00 Amoxicillin 500mg",
  ];

  // Available product options (excluding already selected ones)
  const availableProductOptions = allProductOptions.filter(
    (product) => !selectedProducts.includes(product)
  );

  // Reset product selection when available options change
  useEffect(() => {
    // If current selection is no longer in available options, reset it
    if (
      currentProductSelection &&
      !availableProductOptions.includes(currentProductSelection)
    ) {
      setCurrentProductSelection("");
    }
  }, [availableProductOptions, currentProductSelection]);

  // Mock manufacturer data
  const manufacturerData = {
    "PT BETA PHARMACON": [
      { id: "1", name: "E-61442-04 MASTER BOX TYPE N2" },
      {
        id: "2",
        name: "E-61442-04 DDOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
      },
      {
        id: "3",
        name: "E-61443-04 ALU FOIL CANDESARTAN CILEXETIL TABLET 8 MG 166MM",
      },
      { id: "4", name: "E-61446-02 LEAFLET CANDESARTAN CILEXETIL TABLET" },
    ],
    "PT DEXA MEDICA": [
      { id: "5", name: "E-61442-04 MASTER BOX TYPE N2" },
      {
        id: "6",
        name: "E-61442-04 DDOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
      },
      {
        id: "7",
        name: "E-61443-04 ALU FOIL CANDESARTAN CILEXETIL TABLET 8 MG 166MM",
      },
      { id: "8", name: "E-61446-02 LEAFLET CANDESARTAN CILEXETIL TABLET" },
    ],
    "PT FERRON PAR PHARMACEUTICALS": [
      { id: "9", name: "E-61442-04 MASTER BOX TYPE N2" },
      {
        id: "10",
        name: "E-61442-04 DDOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
      },
    ],
  };

  // Handler for checkbox changes in ProductSelectionCard
  const handleCheckboxChange = (product, itemId) => {
    const key = `${product}-${itemId}`;
    setSelectedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler for next button (proceed to next step)
  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Handler for back button (return to previous step)
  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Handlers for data from EvidenceCard
  const handleUpdateEvidence = (data) => {
    setEditorContent(data.editorContent);
    setUploadedFiles(data.uploadedFiles);
    setProposedChangeContent(data.proposedChangeContent);
    setProposedChangeFiles(data.proposedChangeFiles);
    setChangeReasonContent(data.changeReasonContent);
    setChangeReasonFiles(data.changeReasonFiles);
  };

  // Handle save action for SummaryCard
  const handleSave = () => {
    console.log("Saving data:", {
      selectedItems,
      selectedProducts,
      editorContent,
      uploadedFiles,
      proposedChangeContent,
      proposedChangeFiles,
      changeReasonContent,
      changeReasonFiles,
      requestData,
    });
    alert("Data saved successfully!");
  };

  // Handle submit action for SummaryCard
  const handleSubmit = () => {
    console.log("Submitting data:", {
      selectedItems,
      selectedProducts,
      editorContent,
      uploadedFiles,
      proposedChangeContent,
      proposedChangeFiles,
      changeReasonContent,
      changeReasonFiles,
      requestData,
    });
    alert("Data submitted successfully!");
  };

  // Add product to selection
  const handleAddProduct = () => {
    if (!currentProductSelection) return;

    // Add product to state
    setSelectedProducts([...selectedProducts, currentProductSelection]);

    // Reset selection
    setCurrentProductSelection("");
  };

  // Prepare transformed data for card components
  const getTransformedData = () => {
    return selectedProducts
      .map((product) => {
        const productSites = [];

        Object.entries(manufacturerData).forEach(([manufacturer, items]) => {
          const selectedMaterials = [];

          items.forEach((item) => {
            if (selectedItems[`${product}-${item.id}`]) {
              selectedMaterials.push(item.name);
            }
          });

          if (selectedMaterials.length > 0) {
            productSites.push({
              name: manufacturer,
              materials: selectedMaterials,
            });
          }
        });

        return {
          product,
          sites: productSites,
        };
      })
      .filter((item) => item.sites.length > 0);
  };

  // Check if any items are selected to enable/disable the Next button
  const hasSelectedItems = Object.values(selectedItems).some((value) => value);

  // Determine which content to show based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductSelectionCard
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            manufacturerData={manufacturerData}
            checkedItems={selectedItems}
            onCheckboxChange={handleCheckboxChange}
          />
        );
      case 1:
        return (
          <EvidenceCard
            selectedItems={selectedItems}
            manufacturerData={manufacturerData}
            products={selectedProducts}
            onBack={handleBack}
            onNext={handleNext}
            initialValues={{
              editorContent,
              uploadedFiles,
              proposedChangeContent,
              proposedChangeFiles,
              changeReasonContent,
              changeReasonFiles,
            }}
            onUpdate={handleUpdateEvidence}
          />
        );
      case 2:
        return (
          <SummaryCard
            transformedData={getTransformedData()}
            existingStatusContent={editorContent}
            existingStatusFiles={uploadedFiles}
            proposedChangeContent={proposedChangeContent}
            proposedChangeFiles={proposedChangeFiles}
            changeReasonContent={changeReasonContent}
            changeReasonFiles={changeReasonFiles}
            onBack={handleBack}
            onSave={handleSave}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Render navigation buttons according to current step
  const renderNavigationButtons = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex justify-end mt-4">
            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={!hasSelectedItems || selectedProducts.length === 0}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="flex justify-between mt-10">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              variant="gradient"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between mt-[-20px]">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSave}>
                Save
              </Button>
              <Button variant="gradient" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <MainCard
        title={requestData.category}
        subtitle={requestData.subCategory}
        badgeTitle={requestData.category}
        badgeSubtitle={requestData.subCategory}
        titleBody={
          <div
            /* 1. lebar penuh  2. tarik keluar padding  3. kembalikan padding internal */
            className="flex items-center justify-between gap-4 -mx-4 px-4"
          >
            {/* kiri: judul */}
            <span className="truncate">{requestData.title}</span>

            {/* kanan: dropdown + Add (non‐shrink) */}
            {currentStep === 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Select
                  value={currentProductSelection}
                  onValueChange={setCurrentProductSelection}
                >
                  <SelectTrigger className="w-[300px] h-10 bg-white border border-gray-200 rounded-md shadow-sm">
                    <SelectValue placeholder="Select Finished Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProductOptions.length > 0 ? (
                      availableProductOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No products available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAddProduct}
                  disabled={!currentProductSelection}
                  variant="gradient"
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>
            )}
          </div>
        }
      >
        {renderStepContent()}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 z-10">
          {renderNavigationButtons()}
        </div>
      </MainCard>

      {/* Navigation Buttons Outside the Card */}
    </div>
  );
};

export default PackagingDesignForm;
