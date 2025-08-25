import { Info, Skeleton, Stepper } from "@/components/Dexain";
import MainCard from "@/components/common/MainCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  getStatusColor,
  positionCodes,
} from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";
import { useGetSubmissionApprovalInformation } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useSubmission";
import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import dayjs from "dayjs";
import { Check, EllipsisVertical, History, ScrollText, X } from "lucide-react";
import { Fragment } from "react";
import ModalCancel from "./modals/ModalCancel";
import ModalReassign from "./modals/ModalReassign";

const ApprovalInformation = ({ submissionId }) => {
  const { approvalInformation, isLoadingApprovalInformation } =
    useGetSubmissionApprovalInformation(submissionId);

  const successStatus = ["REVIEW", "APPROVE"];
  return (
    <Skeleton isLoading={isLoadingApprovalInformation}>
      <div className="bg-muted border p-4 rounded-lg max-w-3xl">
        <Stepper
          variant="vertical"
          stepItem={approvalInformation?.map((item) => ({
            icon: successStatus.includes(item.ACTION) ? Check : X,
            state: successStatus.includes(item.ACTION) ? "success" : "error",
            title: (
              <div className="flex flex-col gap-0">
                <div className="text-md text-muted-foreground font-medium">
                  {item.ACTION}
                </div>
                <div className="text-md font-bold">{item.ACTION_BY?.NAME}</div>
              </div>
            ),
            description: (
              <div className="flex flex-col gap-0">
                {item.REMARK && (
                  <div className="flex items-center gap-2 bg-white rounded-lg p-2 text-md text-muted-foreground font-medium italic">
                    <ScrollText className="size-4" /> {item.REMARK}
                  </div>
                )}
              </div>
            ),
            rightContent: (
              <div className="flex flex-col items-end gap-0">
                <p className="text-sm text-muted-foreground">
                  {dayjs(item?.ACTION_DATE).format("D MMMM YYYY")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dayjs(item?.ACTION_DATE).format("HH:mm:ss")}
                </p>
              </div>
            ),
          }))}
        />
      </div>
    </Skeleton>
  );
};

const SubmissionDetailHeader = ({
  submission,
  isMonitoring = false,
  refetch,
}) => {
  const { openSheet, addStack } = useUIStore();
  const user = authStore((state) => state.user);

  return (
    <MainCard
      title="Submission ID"
      badgeTitle={submission?.SUBMISSION_NO}
      subtitle="Status"
      badgeSubtitle={submission?.SUBMISSION_STATUS}
      badgeSubtitleColor={getStatusColor(submission?.SUBMISSION_STATUS)}
      rightContent={(
        <div className="flex items-center gap-2">
          <span
            className="text-primary-normal cursor-pointer"
            onClick={() => {
              openSheet({
                width: "md",
                title: "Approval Information",
                description: `Submission ID: ${submission?.SUBMISSION_NO}`,
                children: <ApprovalInformation submissionId={submission?.SUBMISSION_ID} />,
              })
            }}
          >
            <History className="size-4" />
          </span>
          {!isMonitoring && [positionCodes.SUPERUSER, positionCodes.RA_PMO].includes(user?.ROLE_CODE) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="size-4 text-primary-normal cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                className="w-40 mt-1"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    addStack({
                      type: "modal",
                      size: "3xl",
                      title: "Reassign Submission",
                      container: false,
                      content: <ModalReassign submission={submission} refetch={refetch} />,
                    });
                  }}
                >
                  <span>Re-assign</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    addStack({
                      type: "modal",
                      title: "Cancel Registration Submission?",
                      variant: "info",
                      isForm: true,
                      description: (
                        <>
                          Please review again because this action cannot be
                          undone.
                          <br />
                          and will drop the ongoing registration submission
                          process.
                        </>
                      ),
                      content: <ModalCancel submission={submission} refetch={refetch} />,
                    });
                  }}
                >
                  <span className="text-danger-normal">Cancel Submission</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <Info
          label="Finished Product"
          value={
            <span className="text-primary-normal">
              {submission?.FINISHED_PRODUCT_DESCRIPTION}
            </span>
          }
          containerClassName="col-span-full"
        />
        <Info
          label="Marketing Authorization Holder"
          value={submission?.NIE_MA_HOLDER}
        />
        <Info
          label="Manufacturing Site"
          value={submission?.MANUFACTURING_SITE}
        />
        <Info label="Country" value={submission?.COUNTRY} />
        {/* pake bullet */}
        <Info
          label="Active Ingredient"
          value={
            submission?.ACTIVE_INGREDIENTS?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {submission.ACTIVE_INGREDIENTS.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            ) : (
              "-"
            )
          }
          containerClassName="col-span-full"
        />
      </div>
      {/* buat line seperator dotted line */}
      <div className="border-t border-dashed border-gray-200 my-2" />
      <div className="grid grid-cols-3 gap-4 mt-2">
        <Info
          label="Assigned PIC"
          value={
            <div className="flex flex-col gap-0.5">
              <p className="text-base">{submission?.PIC_RA?.NAME}</p>
              <p className="text-sm text-primary-normal">
                {submission?.PIC_RA?.EMAIL}
              </p>
            </div>
          }
        />
        <Info
          label="Assign Date"
          value={dayjs(submission?.ASSIGNED_AT).format("DD MMM YYYY")}
        />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 border rounded-lg">
        <div className="p-4 border-r">
          <h4 className="text-lg font-semibold mb-2">List of Change Control</h4>
          {submission?.SUBMISSION_LINES?.map((item, i) => (
            <Fragment key={item.SUBMISSION_LINE_ID}>
              {i > 0 && <Separator className="my-2" />}
              <div className="grid grid-cols-2 items-center gap-2">
                <Info
                  label={item.CC_NO}
                  labelClassName="font-semibold text-base text-primary-normal"
                  value={item.CHANGE_TYPE}
                  valueClassName="font-normal text-sm text-muted-foreground"
                />
                <p className="font-semibold text-base">{item.SOURCE}</p>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="p-4">
          <h4 className="text-lg text-muted-foreground font-semibold mb-2">
            Project Task Setup :{" "}
            <span className="text-black">{submission?.REGISTRATION_TYPE}</span>
          </h4>
        </div>
      </div>
    </MainCard>
  );
};

export default SubmissionDetailHeader;
