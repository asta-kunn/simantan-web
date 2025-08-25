import dayjs from "dayjs";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Form,
  Info,
  TextArea,
  Uploader
} from "@/components/Dexain";
import MainCard from "@/components/common/MainCard";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, SendHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getStatusColor,
  positionCodes,
} from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";
import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { z } from "zod";

import { useFile } from "@/hooks/file/useFile";
import { usePatchCancelSubmission } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useSubmission";

const CancelSubmissionForm = ({ submission, refetch }) => {
  const navigate = useNavigate();
  const { addStack, closeStack } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);

  const { uploadFileChunk } = useFile();
  const { cancelSubmission } = usePatchCancelSubmission();

  const formSchema = z.object({
    REMARK: z.string().min(1, { message: "Remark is required" }),
    ATTACHMENT: z.any().refine((val) => val !== null && val !== undefined, {
      message: "Attachment is required",
    }),
  });

  const defaultValues = { REMARK: "", ATTACHMENT: null };

  const handleSubmitCancellation = async (data) => {
    setIsLoading(true);

    try {
      const file = data?.ATTACHMENT;
      const fileExtension = file?.name?.split(".").pop();

      const uploadResponse = await uploadFileChunk({
        file,
        fileName: `CANCELLATION-${submission?.SUBMISSION_NO}.${fileExtension}`,
        docType: "CANCELLATION",
      });

      if (!uploadResponse) {
        throw new Error("Failed to upload document. Please try again!");
      }

      await cancelSubmission({
        SUBMISSION_ID: submission?.SUBMISSION_ID,
        REMARK: data?.REMARK,
        ATTACHMENT: uploadResponse.filePath,
      });

      refetch();
      closeStack();

      addStack({
        type: "modal",
        title: "Success",
        variant: "success",
        description: "Well done! Registration submission dropped on the latest process.",
        footer: (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                closeStack();
                navigate("/product-registration/variation-notification");
              }}
            >
              Back to My Task
            </Button>
            <Button
              variant="outline"
              onClick={() => closeStack()}
            >
              View Task Details
            </Button>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      validation={formSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmitCancellation}
    >
      <TextArea
        name="REMARK"
        label="Remark"
        placeholder="Add a specific reason..."
        required
      />
      <Uploader
        name="ATTACHMENT"
        label="Attachment"
        multiple={false}
        required
      />
      <Separator className="my-4" />
      <div className="w-full flex justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => closeStack()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          icon={<SendHorizontal className="size-4" />}
          type="submit"
          disabled={isLoading}
        >
          Confirm
        </Button>
      </div>
    </Form>
  );
};

const SubmissionDetailHeader = ({
  submission,
  isMonitoring = false,
  refetch,
}) => {
  const { addStack } = useUIStore();
  const user = authStore((state) => state.user);

  return (
    <MainCard
      title="Submission ID"
      badgeTitle={submission?.SUBMISSION_NO}
      subtitle="Status"
      badgeSubtitle={submission?.SUBMISSION_STATUS}
      badgeSubtitleColor={getStatusColor(submission?.SUBMISSION_STATUS)}
      rightContent={
        !isMonitoring &&
          [positionCodes.SUPERUSER, positionCodes.RA_PMO].includes(
            user?.ROLE_CODE
          ) ? (
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
                    content: (
                      <CancelSubmissionForm
                        submission={submission}
                        refetch={refetch}
                      />
                    ),
                  });
                }}
              >
                <span className="text-danger-normal  text-md">
                  Cancel Submission
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null
      }
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
