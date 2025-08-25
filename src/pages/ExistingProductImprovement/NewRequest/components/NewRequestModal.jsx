import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/uiStore";
import { SendHorizontal } from "lucide-react";
import ModalButtons from "@/components/global/ModalButtons";

const NewRequestModal = () => {
  const navigate = useNavigate();
  const closeConfirmationModal = useUIStore((state) => state.closeConfirmationModal);
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    title: "",
  });

  // Sample options for dropdowns
  const categoryOptions = [
    "Packaging Material",
    "Raw Material",
    "Manufacturing Process",
  ];

  const subCategoryOptions = {
    "Packaging Material": ["Packaging Design", "Packaging Composition"],
    "Raw Material": ["Material Change", "Material Quality"],
    "Manufacturing Process": ["Process Improvement", "Process Change"],
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Reset sub-category if category changes
    if (field === "category") {
      newFormData.subCategory = "";
    }
    
    setFormData(newFormData);
  };

  // Handle form clearing
  const handleClearForm = () => {
    setFormData({
      category: "",
      subCategory: "",
      title: "",
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!formData.category || !formData.subCategory || !formData.title) {
      alert("Please fill all fields");
      return;
    }

    // Submit form data
    console.log("Submitting form data:", formData);
    
    // Close modal 
    closeConfirmationModal();
    
    // Format subcategory for URL (convert spaces to dashes and lowercase)
    const formattedSubCategory = formData.subCategory.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to the request page with URL parameters
    navigate(`/epi/new-request/request/${formattedSubCategory}`, { 
      state: {
        category: formData.category,
        subCategory: formData.subCategory,
        title: formData.title
      }
    });
  };

  // Clear form icon
  const clearFormIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16C13.671 16 15 14.669 15 13C15 11.331 13.671 10 12 10C10.329 10 9 11.331 9 13C9 14.669 10.329 16 12 16Z" fill="#B32017"/>
      <path d="M20.817 11.186C20.5814 10.0344 20.1209 8.94048 19.462 7.967C18.8146 7.00928 17.9897 6.18442 17.032 5.537C16.0584 4.87833 14.9646 4.41789 13.813 4.182C13.2081 4.05933 12.5922 3.99901 11.975 4.002V2L8 5L11.975 8V6.002C12.459 6 12.943 6.046 13.41 6.142C14.305 6.32541 15.1552 6.68321 15.912 7.195C16.6584 7.69824 17.3008 8.34063 17.804 9.087C18.5853 10.2422 19.002 11.6054 19 13C18.9998 13.9359 18.8128 14.8623 18.45 15.725C18.2735 16.1405 18.0579 16.5383 17.806 16.913C17.5531 17.2854 17.2659 17.6332 16.948 17.952C15.98 18.9182 14.7511 19.5809 13.412 19.859C12.4807 20.047 11.5213 20.047 10.59 19.859C9.69456 19.6754 8.84404 19.3173 8.087 18.805C7.34148 18.3022 6.6998 17.6605 6.197 16.915C5.41656 15.7585 4.9997 14.3952 5 13H3C3.00106 14.7937 3.53689 16.5463 4.539 18.034C5.18685 18.9901 6.01086 19.8142 6.967 20.462C8.45262 21.4675 10.2061 22.0033 12 22C12.6093 21.9999 13.217 21.9386 13.814 21.817C14.9647 21.5794 16.0579 21.1191 17.032 20.462C17.5103 20.1397 17.956 19.7717 18.363 19.363C18.7705 18.9544 19.1388 18.5084 19.463 18.031C20.4676 16.5458 21.0031 14.7931 21 13C20.9999 12.3907 20.9386 11.783 20.817 11.186Z" fill="#B32017"/>
    </svg>
  );

  return (
    <div className="space-y-6 -mx-6">
      {/* Title with dashed border - extending full width */}
      <div className="pb-4 mb-4 border-b border-dashed border-[#D2DEEB] w-full px-6">
        <h2 className="text-xl font-bold">Add new Request</h2>
      </div>
      
      <div className="px-6">
        {/* Step 1: EPI Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">EPI Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Step 2: Additional fields after category selection */}
        {formData.category && (
          <>
            {/* EPI Sub Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">EPI Sub Category</label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) => handleChange("subCategory", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category &&
                    subCategoryOptions[formData.category]?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* EPI Request Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">EPI Request Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter request title"
              />
            </div>
          </>
        )}
      </div>

      {/* Footer with buttons - extending full width */}
      <div className="-mx-6 px-6">
        <ModalButtons 
          onCancel={handleClearForm}
          onConfirm={handleSubmit}
          cancelText="Clear Form"
          confirmText="Submit Form"
          cancelIcon={clearFormIcon}
          confirmIcon={<SendHorizontal className="h-5 w-5" />}
          disableConfirm={!formData.category || !formData.subCategory || !formData.title}
        />
      </div>
    </div>
  );
};

export default NewRequestModal; 