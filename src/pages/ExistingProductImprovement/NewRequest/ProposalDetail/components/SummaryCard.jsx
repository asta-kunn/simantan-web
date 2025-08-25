import React from "react";
import { cn } from "@/lib/utils";
import Card from "@/components/common/Card";
import CardDescription from "@/components/common/CardDescription";
import { MdFileDownload } from "react-icons/md";

const SummaryCard = ({
  transformedData,
  existingStatusContent,
  existingStatusFiles,
  proposedChangeContent,
  proposedChangeFiles,
  changeReasonContent,
  changeReasonFiles
}) => {
  // Function to handle file downloads (mock)
  const handleDownload = (files) => {
    console.log("Downloading files:", files);
    alert(`Downloading ${files.length} file(s)`);
  };

  // Component for displaying read-only content
  const ReadOnlyContentCard = ({ title, content, files }) => {
    return (
      <div className="mb-4 relative rounded-lg border shadow">
        <div className="flex items-center bg-[#F9FAFB] ">
          <div className="inline-block bg-[#5b595b] text-white font-bold text-lg rounded-tl-lg rounded-br-lg px-4 py-1 shadow-sm" 
            style={{ paddingTop: '7px', paddingBottom: '9px', marginLeft: '-1px' }}>
            {title}
          </div>
          
          {files && files.length > 0 && (
            <div 
              className="inline-flex items-center text-primary-normal font-medium cursor-pointer ml-3 bg-[#F9FAFB] px-2 py-1 rounded"
              onClick={() => handleDownload(files)}
            >
              Download <MdFileDownload className="ml-1" />
            </div>
          )}
        </div>
        
        <div className={cn(
          " overflow-hidden",
          "bg-[#F9FAFB]"
        )}>
          <div
            className="p-5 text-black overflow-y-auto content-container"
            style={{ 
              height: "200px",
              backgroundColor: "#F9FAFB",
              wordWrap: "break-word"
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="overflow-y-auto pr-2 max-h-[calc(100vh-200px)]">
      <Card
        title="Finished Products"
        variant="dark"
        className="mb-4"
        scrollable
        style={{ height: 'auto', maxHeight: '280px', backgroundColor: "#F9FAFB" }}
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

      <ReadOnlyContentCard 
        title="Existing Status" 
        content={existingStatusContent} 
        files={existingStatusFiles} 
      />

      <ReadOnlyContentCard 
        title="Proposed Change" 
        content={proposedChangeContent} 
        files={proposedChangeFiles} 
      />

      <ReadOnlyContentCard 
        title="Change Reason/Justification" 
        content={changeReasonContent} 
        files={changeReasonFiles} 
      />
    </div>
  );
};

export default SummaryCard; 