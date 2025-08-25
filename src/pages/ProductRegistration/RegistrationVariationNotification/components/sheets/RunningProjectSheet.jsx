import { useUIStore } from "@/stores/uiStore";
import MainCard from "@/components/common/MainCard";
import { sampleEPIRequests } from "../../Submission/sampleSchemas";

export const useRunningProjectSheet = () => {
  const { openSheet } = useUIStore();

  const openRunningProjectSheet = (productData) => {
    openSheet({
      title: "Current Project Running",
      description: <span className="text-black">{productData?.finishedProduct}</span>,
      width: "lg",
      children: (
        <div className="flex flex-col gap-4">
          {sampleEPIRequests.map((request, index) => (
            <MainCard
              key={index}
              badgeTitle={request.requestId}
              title="EPI Request ID"
              className="mb-4"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">EPI Category</div>
                  <div className="font-medium">{request.category}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">EPI Sub Category</div>
                  <div className="font-medium">{request.subCategory}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 mb-1">
                    {request.changeTitle ? "Change Title" : "EPI Request Title"}
                  </div>
                  <div className="font-medium">{request.changeTitle || request.title}</div>
                </div>
                <div className="col-span-2 border-t border-gray-200 my-2"></div>
                <div>
                  <div className="text-gray-500 mb-1">CC No.</div>
                  <div className="font-medium">{request.cc}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Current Process</div>
                  <div className="font-medium">{request.process}</div>
                </div>
              </div>
            </MainCard>
          ))}
        </div>
      ),
      primaryButton: "OK",
      buttonPositions: "end",
      onOk: () => {
        console.log("Sheet OK clicked");
      },
    });
  };

  return { openRunningProjectSheet };
}; 