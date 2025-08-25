import React, { useState, useEffect } from "react";
import CardDescription from "@/components/common/CardDescription";
import Card from "@/components/common/Card";
import { TextEditor } from "@/components/common/TextEditor";
import InputFile from "@/components/common/InputFile";

const EvidenceCard = ({ 
  selectedItems, 
  manufacturerData, 
  products, 
  onBack, 
  onNext,
  initialValues = {
    editorContent: '',
    uploadedFiles: [],
    proposedChangeContent: '',
    proposedChangeFiles: [],
    changeReasonContent: '',
    changeReasonFiles: []
  },
  onUpdate
}) => {
  const [editorContent, setEditorContent] = useState(initialValues.editorContent || '');
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.uploadedFiles || []);
  const [proposedChangeContent, setProposedChangeContent] = useState(initialValues.proposedChangeContent || '');
  const [proposedChangeFiles, setProposedChangeFiles] = useState(initialValues.proposedChangeFiles || []);
  const [changeReasonContent, setChangeReasonContent] = useState(initialValues.changeReasonContent || '');
  const [changeReasonFiles, setChangeReasonFiles] = useState(initialValues.changeReasonFiles || []);

  // Update parent component whenever form values change
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        editorContent,
        uploadedFiles,
        proposedChangeContent,
        proposedChangeFiles,
        changeReasonContent,
        changeReasonFiles
      });
    }
  }, [
    editorContent,
    uploadedFiles,
    proposedChangeContent,
    proposedChangeFiles,
    changeReasonContent,
    changeReasonFiles,
    onUpdate
  ]);

  // Transform selected items into the format expected by CardDescription
  const transformedData = products.map(product => {
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
  }).filter(item => item.sites.length > 0); // Only include products with selected items
  
  const handleTextEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleFilesSelected = (files) => {
    setUploadedFiles(files);
  };
  
  const handleProposedChangeEditorChange = (content) => {
    setProposedChangeContent(content);
  };

  const handleProposedChangeFilesSelected = (files) => {
    setProposedChangeFiles(files);
  };
  
  const handleChangeReasonEditorChange = (content) => {
    setChangeReasonContent(content);
  };

  const handleChangeReasonFilesSelected = (files) => {
    setChangeReasonFiles(files);
  };
  
  // Custom empty content for TextEditor
  const emptyContent = '';
  
  return (
    <div className="overflow-y-auto pr-2 max-h-[550px]">
      <Card 
        title="Finished Products" 
        variant="dark" 
        className="mb-4"
        scrollable 
        style={{ height: '280px' }}
        customStyle={{ contentStyle: { maxHeight: '220px' } }}
      >  
        {transformedData.length > 0 ? (
          <div className="flex flex-col gap-4">
            {transformedData.map((item, index) => (
              <CardDescription 
                key={index}
                cardDescriptionTitle={item.product}
                item={item.sites}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No items selected</p>
          </div>
        )}
      </Card>

      {/* Existing Status Card */}
      <Card 
        title="Existing Status" 
        variant="dark" 
        className="mb-4"
        style={{ height: '250px' }}
      >
        <div className="flex h-full gap-8">
          {/* Text Editor Side (Left) */}
          <div className="flex-1 h-full text-black">
            <TextEditor 
              onChange={handleTextEditorChange} 
              initialValue={editorContent || emptyContent}
              showToolbar={true}
              height="190px"
              className="h-full"
            />
          </div>
          
          {/* File Upload Side (Right) */}
          <div className="w-[170px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
              <InputFile 
                onFilesSelected={handleFilesSelected}
                accept=".doc,.docx,.pdf,.ppt,.pptx"
                maxSizeMB={20}
                className="text-black scale-125"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Proposed Change Card */}
      <Card 
        title="Proposed Change" 
        variant="dark" 
        className="mb-4"
        style={{ height: '250px' }}
      >
        <div className="flex h-full gap-8">
          {/* Text Editor Side (Left) */}
          <div className="flex-1 h-full text-black">
            <TextEditor 
              onChange={handleProposedChangeEditorChange} 
              initialValue={proposedChangeContent || emptyContent}
              showToolbar={true}
              height="190px"
              className="h-full"
            />
          </div>
          
          {/* File Upload Side (Right) */}
          <div className="w-[170px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full text-black">
              <InputFile 
                onFilesSelected={handleProposedChangeFilesSelected}
                accept=".doc,.docx,.pdf,.ppt,.pptx"
                maxSizeMB={20}
                className="text-black scale-125"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Change Reason/Justification Card */}
      <Card 
        title="Change Reason/Justification" 
        variant="dark" 
        className="mb-4"
        style={{ height: '250px' }}
      >
        <div className="flex h-full gap-8">
          {/* Text Editor Side (Left) */}
          <div className="flex-1 h-full text-black">
            <TextEditor 
              onChange={handleChangeReasonEditorChange} 
              initialValue={changeReasonContent || emptyContent}
              showToolbar={true}
              height="190px"
              className="h-full"
            />
          </div>
          
          {/* File Upload Side (Right) */}
          <div className="w-[170px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
              <InputFile 
                onFilesSelected={handleChangeReasonFilesSelected}
                accept=".doc,.docx,.pdf,.ppt,.pptx"
                maxSizeMB={20}
                className="text-black scale-125"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EvidenceCard; 