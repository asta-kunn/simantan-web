import React from "react";
import CardDescription from "@/components/common/CardDescription";
import Card from "@/components/common/Card";
import { MdFileDownload } from "react-icons/md";
import { cn } from "@/lib/utils";

const SummaryCard = ({
  transformedData,
  existingStatusContent,
  existingStatusFiles,
  proposedChangeContent,
  proposedChangeFiles,
  changeReasonContent,
  changeReasonFiles,
  onBack,
  onSave,
  onSubmit
}) => {

  const handleDownload = (files) => {
    console.log("Downloading files:", files);
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Custom styles for the rendered content from TextEditor
  const editorContentStyles = `
    .content-container h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container h2 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container h3 {
      font-size: 1.125rem;
      font-weight: bold;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container h4 {
      font-size: 1rem;
      font-weight: bold;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container p {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container ol {
      list-style-type: decimal;
      padding-left: 1.5rem; 
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .content-container li {
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
    }
  `;

  // Add styles to document head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = editorContentStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
    <div className="overflow-y-auto pr-2 max-h-[550px]">
      <Card
        title="Finished Products"
        variant="dark"
        className="mb-4"
        scrollable
        style={{ height: "280px", backgroundColor: "#F9FAFB" }}
        customStyle={{ contentStyle: { maxHeight: "220px" } }}
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
