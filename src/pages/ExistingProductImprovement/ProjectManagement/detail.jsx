import React, { useEffect, useState } from "react";
import MainCard from "@/components/common/MainCard";
import Card from "@/components/common/Card";
import { TimelineVertical } from "@/components/common/TimelineVertical";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/Dexain";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const defaultTimelineData = [
  {
    title: "Create New Item E/New Version of Item E",
    status: "Not Started",
    statusText: "Not Started",
    details: {
      targetCompletionDate: "21 December 2025",
      actualCompletionDate: "21 December 2025"
    }
  },
  {
    title: "Create AW1",
    status: "not_completed",
    statusText: "Not Completed",
    details: {
      targetCompletionDate: "22 December 2025",
      actualCompletionDate: "-"
    }
  },
  {
    title: "Registration Submission",
    status: "Not Completed",
    statusText: "Not Completed",
    details: {
      targetCompletionDate: "23 December 2025",
      actualCompletionDate: "-"
    }
  },
  {
    title: "Registration Approval",
    status: "rejected",
    statusText: "Rejected",
    details: {
      targetCompletionDate: "24 December 2025",
      actualCompletionDate: "-"
    }
  },
  {
    title: "Create SPM & AW2 in Infotechna",
    status: "completed",
    statusText: "Completed",
    details: {
      targetCompletionDate: "25 December 2025",
      actualCompletionDate: "-"
    }
  },
  {
    title: "Create SPM & AW2 in Infotechna",
    status: "completed",
    statusText: "Completed",
    details: {
      targetCompletionDate: "25 December 2025",
      actualCompletionDate: "-"
    }
  },
  {
    title: "Create SPM & AW2 in Infotechna",
    status: "completed",
    statusText: "Completed",
    details: {
      targetCompletionDate: "25 December 2025",
      actualCompletionDate: "-"
    }
  }
];

const getStatusBadgeColor = (status) => {
  if (!status) return "gray";
  const s = status.toLowerCase();
  if (s === "completed") return "green";
  if (s === "rejected" || s === "terminated") return "red";
  if (s === "in progress" || s === "started") return "blue";
  return "gray";
};

const ProjectManagementDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    projectId: "",
    epiNo: "",
    product: "",
    site: "",
    registrationType: "",
    ccNo: "",
    packagingMaterial: "",
    category: "",
    subcategory: "",
    title: "",
  });
  const [timelineData, setTimelineData] = useState(defaultTimelineData);

  useEffect(() => {
    // Get project data from localStorage
    const storedData = localStorage.getItem("selectedProjectData");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProjectData(parsedData);
      } catch (error) {
        console.error("Error parsing project data from localStorage:", error);
      }
    }

    // In a real app, fetch timeline data based on projectId
    // const projectId = searchParams.get("projectId");
    // fetchTimelineData(projectId).then(data => setTimelineData(data));
  }, [searchParams]);

  return (
    <>
      <div className="pt-5 pr-2 pl-5 pb-16">
        <MainCard
          title="Finished Product"
          badgeTitle={projectData.product}
          titleBody={projectData.title}
          badgeSubtitle={projectData.status}
          badgeSubtitleColor={getStatusBadgeColor(projectData.status)}
        >
          {/* Project Information */}
          <Card title="Project Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">Project ID</span>
                  <span className="ml-2">{projectData.epiNo}</span>
                </div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">EPI Category</span>
                  <span className="ml-2">{projectData.category}</span>
                </div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">
                    EPI Sub Category
                  </span>
                  <span className="ml-2">{projectData.subcategory}</span>
                </div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">
                    Registration Type
                  </span>
                  <span className="ml-2">{projectData.registrationType}</span>
                </div>
              </div>
              <div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">CC No</span>
                  <span className="ml-2">{projectData.ccNo}</span>
                </div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">
                    Manufacturing Site
                  </span>
                  <span className="ml-2">{projectData.site}</span>
                </div>
                <div className="flex mb-1">
                  <span className="font-bold min-w-[150px]">
                    Packaging Material
                  </span>
                  <span className="ml-2">{projectData.packagingMaterial}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Project Task */}
          <Card title="Project Task">
            <TimelineVertical
              items={timelineData.map(item => ({
                ...item,
                children: (
                  <Card className="bg-[#f5f8fb] border-0 shadow-none mt-2 mb-2">
                    <div className="flex items-center gap-x-8">
                      <span className="text-sm text-gray-500 min-w-[180px]">Target Completion Date</span>
                      <span className="text-sm">{item.details?.targetCompletionDate || '-'}</span>
                    </div>
                    <div className="flex items-center gap-x-8">
                      <span className="text-sm text-gray-500 min-w-[180px]">Actual Completion Date</span>
                      <span className="text-sm">{item.details?.actualCompletionDate || '-'}</span>
                    </div>
                  </Card>
                )
              }))}
            />
          </Card>
        </MainCard>

      <div className="flex justify-start">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <FaArrowLeft /> 
          Back
        </Button>
      </div>
    </div>
    </>
  );
};

export default ProjectManagementDetail;
