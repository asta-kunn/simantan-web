import { Tabs, TextEditor } from "@/components/Dexain";
import InputFile from "@/components/common/InputFile";
import { TimelineHorizontal } from "@/components/common/TimelineHorizontal";
import { TimelineVertical } from "@/components/common/TimelineVertical";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ApprovalStep } from "./ApprovalStep";

// Helper component to generate long content
const LongContent = ({ title }) => (
  <div className="space-y-4">
    <h3 className="font-medium">{title}</h3>
    <p>This is a demonstration of content that is long enough to scroll.</p>
    {Array(15)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="p-3 bg-gray-50 border rounded mb-3">
          <h4 className="font-medium">Section {i + 1}</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed
            auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
          </p>
        </div>
      ))}
  </div>
);

// Custom timeline content components
const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-slate-100 p-3 rounded max-w-xl", className)}>
      {children}
    </div>
  );
};

const Text = ({ children, className }) => {
  return (
    <div className={cn("text-sm text-gray-600", className)}>{children}</div>
  );
};

const CompletionDates = ({ targetDate, actualDate, className }) => {
  return (
    <Card className={className}>
      <div className="grid grid-cols-2 gap-2">
        <span className="text-sm text-muted-foreground">
          Target Completion Date
        </span>
        <span className="text-sm font-medium">{targetDate}</span>
        <span className="text-sm text-muted-foreground">
          Actual Completion Date
        </span>
        <span className="text-sm font-medium">{actualDate}</span>
      </div>
    </Card>
  );
};

function Rifqi() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesSelected = (files) => {
    setUploadedFiles(files);
    console.log("Files selected:", files);
  };

  // Sample timeline data
  const timelineData = [
    {
      title: "Project Started",
      date: "January 15, 2023",
      description:
        "Initial project planning and requirements gathering phase completed.",
    },
    {
      title: "Design Phase",
      date: "February 10, 2023",
      description:
        "UI/UX design and prototype creation finalized with stakeholder approval.",
    },
    {
      title: "Development Kickoff",
      date: "March 5, 2023",
      description:
        "Development team started implementing the approved designs and functionality.",
    },
    {
      title: "Beta Testing",
      date: "April 20, 2023",
      description:
        "First beta version released for internal testing and feedback collection.",
    },
  ];

  // Sample vertical timeline items with children
  const verticalTimelineItems = [
    {
      title: "Create New Item E/New Version of Item E",
      status: "completed",
      statusText: "Completed",
      children: (
        <CompletionDates
          targetDate="21 December 2025"
          actualDate="21 December 2025"
        />
      ),
    },
    {
      title: "Initial Documentation Review",
      status: "rejected",
      statusText: "Rejected",
      children: (
        <Text>
          Documentation was rejected due to missing signatures and incomplete
          forms
        </Text>
      ),
    },
    {
      title: "Submit Pre-Reg Date",
      status: "not_completed",
      statusText: "Not Completed",
      children: (
        <Card>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-muted-foreground">
              Target Completion Date
            </span>
            <span className="text-sm font-medium">21 December 2025</span>
            <span className="text-sm text-muted-foreground">
              Actual Completion Date
            </span>
            <span className="text-sm font-medium">21 December 2025</span>
          </div>
        </Card>
      ),
    },
    {
      title: "Need Additional Data",
      status: "not_completed",
      statusText: "Not Completed",
      children: <Text>Submit Pre-Reg Additional Data Submission Date</Text>,
    },
    {
      title: "Submit Pre-Reg Result Date Upload Pre-Reg Doc",
      status: "not_completed",
      statusText: "Not Completed",
      children: (
        <Text>Upload required pre-registration documents and results</Text>
      ),
    },
    {
      title: "Registration Submission",
      status: "not_completed",
      statusText: "Not Completed",
      children: <Text>Submit all registration documents</Text>,
    },
    {
      title: "Registration Approval",
      status: "not_completed",
      toggle: <Switch />,
      children: <Text>Awaiting registration approval from authorities</Text>,
    },
  ];

  // Sample horizontal approval timeline data
  const horizontalTimelineItems = [
    {
      status: "completed",
      children: (
        <ApprovalStep
          title="Submitted by"
          name="Dito Rido Wibowo"
          email="dito.wibowo@dexagroup.com"
          position="Regulatory Affairs"
          company="PT Dexa Medica"
          date="21 December 2024"
          time="16:57:00"
        />
      ),
    },
    {
      status: "completed",
      children: (
        <ApprovalStep
          title="Approved"
          name="Jaya Putra"
          email="jaya.putra@dexagroup.com"
          position="Direct Manager RA"
          company="PT Dexa Medica"
          date="21 December 2024"
          time="16:57:00"
          remarks="Sudah ok 👍"
        />
      ),
    },
    {
      status: "rejected",
      children: (
        <ApprovalStep
          title="Quality Review"
          name="Abdul Rahman"
          email="abdul@dexagroup.com"
          position="Quality Department"
          company="PT Dexa Medica"
          date="22 December 2024"
          time="09:15:00"
          remarks="Needs revisions in product description"
        />
      ),
    },
    {
      status: "not_completed",
      children: (
        <ApprovalStep
          title="Final Approval"
          name="Awaiting"
          position="Director"
          company="PT Dexa Medica"
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Tabs Section */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Component Guidelines</h1>

        {/* Text Editor Section */}
        <div className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold border-b pb-2">
            Text Editor Component
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Rich text editor with formatting toolbar.
          </p>

          <div className="p-6 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <TextEditor />
            </div>
          </div>
        </div>

        {/* New Horizontal Timeline Section */}
        <div className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold border-b pb-2">
            Horizontal Timeline with Approval Steps
          </h2>
          <div className="border p-4 rounded-lg bg-white overflow-x-auto">
            <TimelineHorizontal items={horizontalTimelineItems} />
          </div>
        </div>

        {/* New Vertical Timeline Section */}
        <div className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold border-b pb-2">
            Vertical Timeline with Status
          </h2>
          <TimelineVertical items={verticalTimelineItems} />
        </div>

        {/* Input File Section */}
        <div className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold border-b pb-2">
            Input File Component
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop file uploader with file validation.
          </p>

          <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center">
            <InputFile
              onFilesSelected={handleFilesSelected}
              accept=".doc,.docx,.pdf,.ppt"
              maxSizeMB={20}
            />

            <div className="mt-4 bg-blue-50 p-3 rounded text-sm w-full">
              <strong>Usage notes:</strong>
              <ul className="list-disc ml-4 mt-2">
                <li>Supports drag and drop or click to select</li>
                <li>Validates file type and size</li>
                <li>Customizable file types and max size</li>
                <li>Returns array of selected files via callback</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold border-b pb-2">Tabs Component</h2>

        {/* Normal Tabs Example */}
        <div className="space-y-2">
          <h3 className="font-medium">Normal Variant</h3>
          <p className="text-sm text-gray-600 mb-2">
            Used for content navigation with distinct sections. Tabs scroll with
            content.
          </p>

          <div className="border rounded-lg bg-gray-50 overflow-hidden">
            <div
              style={{ height: "500px", overflow: "auto" }}
              className="normal-tabs-container"
            >
              <Tabs
                variant="normal"
                tabs={[
                  {
                    label: "Overview",
                    value: "overview",
                    content: <LongContent title="Overview Content" />,
                  },
                  {
                    label: "Details",
                    value: "details",
                    content: <LongContent title="Details Content" />,
                  },
                  {
                    label: "Settings",
                    value: "settings",
                    content: <LongContent title="Settings Content" />,
                  },
                ]}
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-b text-sm">
              <strong>Note:</strong> Normal tabs scroll with the content. Try
              scrolling up and down to see the tabs disappear.
            </div>
          </div>
        </div>

        {/* Sticky Tabs Example */}
        <div className="space-y-2">
          <h3 className="font-medium">Sticky Variant</h3>
          <p className="text-sm text-gray-600 mb-2">Used for main navigation that follows the user&apos;s scroll. Features red underline indicator on active state.</p>

          <div className="border rounded-lg bg-gray-50 overflow-hidden">
            <div
              style={{ height: "500px", overflow: "auto" }}
              className="sticky-tabs-container"
            >
              <Tabs
                sticky="top"
                tabs={[
                  {
                    label: (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                      </div>
                    ),
                    value: "home",
                    content: <LongContent title="Home Content" />,
                  },
                  {
                    label: "Profile",
                    value: "profile",
                    content: <LongContent title="Profile Content" />,
                  },
                  {
                    label: "Notifications",
                    value: "notifications",
                    content: <LongContent title="Notifications Content" />,
                  },
                ]}
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-b text-sm">
              <strong>Note:</strong> Sticky tabs remain visible at the top while
              scrolling content. Try scrolling to see how tabs stay fixed while
              content scrolls underneath.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rifqi;
