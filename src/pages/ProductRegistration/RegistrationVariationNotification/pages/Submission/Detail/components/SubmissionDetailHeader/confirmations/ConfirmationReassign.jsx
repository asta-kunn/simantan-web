import { Info, Separator } from "@/components/Dexain";
import { ArrowLeftRight } from "lucide-react";

const ConfirmationReassign = ({ submission, newAssignedPIC }) => {
  return (
    <>
      <div className="px-2 py-2 rounded-md bg-[#e9eef5] gap-2">
        <div className="flex flex-col gap-2 mb-2">
          <Info label="Submission ID" value={submission.SUBMISSION_NO} />
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <Info
            label="Finished Product"
            value={submission.FINISHED_PRODUCT_DESCRIPTION}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Info label="MA Holder" value={submission.NIE_MA_HOLDER} />
          <Info
            label="Manufacturing Site"
            value={submission.MANUFACTURING_SITE}
          />
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-2 gap-6 relative mb-1">
          <Info
            label="Previous PIC"
            value={
              <>
                <div className="font-semibold text-md">
                  {submission?.PIC_RA?.NAME}
                </div>

                <div className="text-sm text-primary-normal">
                  {submission?.PIC_RA?.EMAIL}
                </div>
              </>
            }
          />
          <ArrowLeftRight className="w-3 h-3 text-primary-normal absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <Info label="Reassign To" value={
              <>
                <div className="font-semibold text-md">
                  {newAssignedPIC?.NAME}
                </div>

                <div className="text-sm text-primary-normal">
                  {newAssignedPIC?.EMAIL}
                </div>
              </>
            } />
        </div>
      </div>
    </>
  );
};

export default ConfirmationReassign;
