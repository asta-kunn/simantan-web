import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@/hooks/use-mutation";
import MainCard from "@/components/common/MainCard";
import { Button } from "@/components/Dexain";
import { ArrowLeft, ChevronRight } from "lucide-react";
import EvidenceCard from "./components/EvidenceCard";
import SummaryCard from "./components/SummaryCard";

const RequestDetail = () => {
  const { mutate, loading, error, response } = useMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");

  // State to track the current step (0 = EvidenceCard, 1 = SummaryCard)
  const [currentStep, setCurrentStep] = useState(0);

  // Get the request data from localStorage
  const requestDataString = localStorage.getItem("selectedRequestData");
  const requestData = requestDataString ? JSON.parse(requestDataString) : null;

  // Initialize evidence data from the request
  const [evidenceData, setEvidenceData] = useState({
    editorContent: requestData?.existingStatus || "<p>No existing status provided.</p>",
    uploadedFiles: [
      { name: "existing_design.pdf", size: 1024000 },
      { name: "current_specs.docx", size: 512000 }
    ],
    proposedChangeContent: requestData?.proposedChange || "<p>No proposed change provided.</p>",
    proposedChangeFiles: [
      { name: "new_design_proposal.pdf", size: 1536000 },
      { name: "design_changes.docx", size: 768000 }
    ],
    changeReasonContent: requestData?.changeReason || "<p>No change reason provided.</p>",
    changeReasonFiles: [
      { name: "regulation_document.pdf", size: 2048000 }
    ]
  });

  // Sample manufacturer data
  const manufacturerData = {
    "PT Beta Pharmacon": [
      { id: 1, name: "E-61444-04 DOOS CANDESARTAN CILEXETIL TABLET 16 MG 3X10'S" },
      { id: 2, name: "E-61444-05 DOOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S" }
    ],
    "PT Dexa Medica": [
      { id: 3, name: "E-61444-06 DOOS CANDESARTAN CILEXETIL TABLET 32 MG 3X10'S" },
      { id: 4, name: "E-61444-07 DOOS CANDESARTAN CILEXETIL TABLET 64 MG 3X10'S" }
    ]
  };

  // Sample selected items for evidence card
  const [selectedItems, setSelectedItems] = useState({
    "A-1235-00 Candesartan 16mg-1": true,
    "A-1235-00 Candesartan 8mg-2": true
  });

  // Products for evidence card
  const [selectedProducts, setSelectedProducts] = useState(
    requestData?.products || ["A-1235-00 Candesartan 16mg", "A-1235-00 Candesartan 8mg"]
  );

  const handleUpdateEvidence = (data) => {
    setEvidenceData(data);
  };

  // Handler for next button (proceed to next step)
  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  // Handler for back button (return to previous step)
  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/epi/new-request");
    } else {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const handleSave = () => {
    console.log("Saving data:", {
      ...evidenceData,
      requestData
    });
    alert("Data saved successfully!");
  };

  const handleSubmit = () => {
    console.log("Submitting data:", {
      ...evidenceData,
      requestData
    });
    alert("Data submitted successfully!");
  };

  // Transform selected items for SummaryCard
  const getTransformedData = () => {
    return selectedProducts.map(product => {
      const productSites = [];

      // Group by manufacturer (site)
      Object.entries(manufacturerData).forEach(([manufacturer, items]) => {
        const selectedMaterials = [];

        // Find selected items for this product and manufacturer
        items.forEach(item => {
          if (selectedItems[`${product}-${item.id}`]) {
            selectedMaterials.push(item.name);
          }
        });

        // Only add manufacturer if there are selected materials
        if (selectedMaterials.length > 0) {
          productSites.push({
            name: manufacturer,
            materials: selectedMaterials
          });
        }
      });

      return {
        product,
        sites: productSites
      };
    }).filter(item => item.sites.length > 0);
  };

  if (!requestData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Request Detail</h1>
        <p className="text-primary-normal-600">No request data found. Please select a request from the list.</p>
        <Button
          variant="outline"
          onClick={() => navigate("/epi/new-request")}
          className="flex items-center gap-2 mt-4"
        >
          <ArrowLeft size={16} />
          Back to Request List
        </Button>
      </div>
    );
  }

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <EvidenceCard
            selectedItems={selectedItems}
            manufacturerData={manufacturerData}
            products={selectedProducts}
            initialValues={evidenceData}
            onUpdate={handleUpdateEvidence}
          />
        );
      case 1:
        return (
          <SummaryCard
            transformedData={getTransformedData()}
            existingStatusContent={evidenceData.editorContent}
            existingStatusFiles={evidenceData.uploadedFiles}
            proposedChangeContent={evidenceData.proposedChangeContent}
            proposedChangeFiles={evidenceData.proposedChangeFiles}
            changeReasonContent={evidenceData.changeReasonContent}
            changeReasonFiles={evidenceData.changeReasonFiles}
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
          <div className="flex justify-between mt-6">
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
      case 1:
        return (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="gradient"
                onClick={handleSubmit}
              >
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
    <div className="flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Sticky header */}
      <div className="top-0 z-10 bg-white border-b p-4">
        
            <h1 className="text-xl font-bold">{requestData.title || "Request Detail"}</h1>
        
      </div>

      {/* Scrollable content area */}
      <div className="relative flex-1 overflow-y-auto p-6 mb-8">
  
          {renderStepContent()}
          
            {renderNavigationButtons()}
          
      </div>
      
    </div>
  );
};

export default RequestDetail; 