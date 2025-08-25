import React, { useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import PackagingDesignForm from "./PackagingDesign";

const ProposalRequest = () => {
  const { subCategory } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    console.log("ProposalRequest component loaded");
    console.log("subCategory:", subCategory);
    console.log("location state:", state);
  }, [subCategory, state]);

  // Create a default state if none is provided (to make the page work even without state)
  const defaultState = {
    category: "Packaging Material",
    subCategory: "Packaging Design",
    title: "Test Request"
  };
  
  const validState = state || defaultState;

  // Verify that we have the required state data
  if (!state) {
    console.warn("No state provided, using default state");
  }

  // Map subcategory parameter to component
  const renderSubCategoryComponent = () => {
    switch (subCategory) {
      case "packaging-design":
        return <PackagingDesignForm state={validState} />;
      case "packaging-composition":
        // When you create this component, uncomment this line
        // return <PackagingComposition state={state} />;
        return <div>Packaging Composition - Coming Soon</div>;
      case "material-change":
        return <div>Material Change - Coming Soon</div>;
      case "material-quality":
        return <div>Material Quality - Coming Soon</div>;
      case "process-improvement":
        return <div>Process Improvement - Coming Soon</div>;
      case "process-change":
        return <div>Process Change - Coming Soon</div>;
      default:
        console.warn(`Unknown subCategory: ${subCategory}`);
        return <Navigate to="/epi/new-request" replace />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{validState.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        <span className="font-medium">Category: </span>{validState.category} | 
        <span className="font-medium ml-2">Sub-Category: </span>{validState.subCategory}
      </div>
      
      {renderSubCategoryComponent()}
    </div>
  );
};

export default ProposalRequest; 