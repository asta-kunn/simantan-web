import { Button, Form, Separator, TextArea } from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

/** Hooks */
import { usePutSubmissionApproval } from "@/pages/ProductRegistration/Approval/detail/New/hooks/useApproval";

/** Icons */
import { SendHorizontal } from "lucide-react";

const ConfirmationRejectSubmission = ({ submissionId, refetch }) => {
  const navigate = useNavigate();

  const { addStack, closeStack, clearStacks } = useUIStore();

  const {
    isPending: isPendingPutSubmissionApproval,
    mutateAsync: putSubmissionApproval,
  } = usePutSubmissionApproval();

  return (
    <Form
      validation={z.object({
        REMARK: z.string().min(1, "Remark is required"),
      })}
      defaultValues={{ REMARK: "" }}
      onSubmit={async (data) => {
        await putSubmissionApproval({
          SUBMISSION_ID: submissionId,
          ACTION: "REJECT",
          REMARK: data?.REMARK,
        });
        refetch();
        addStack({
          title: "Successfully Rejected Marketing Authorization (NIE) Document",
          description:
            "Marketing Authorization (NIE) Document has been rejected, and the submission will be returned to the RA Support System",
          variant: "success",
          footer: (
            <div className="w-full flex flex-col gap-2">
              <Button
                onClick={() => {
                  clearStacks();
                  navigate("/product-registration/approval");
                }}
              >
                Back to Approval Task
              </Button>
            </div>
          ),
        });
      }}
    >
      <TextArea
        name="REMARK"
        label="Remark"
        placeholder="Reason for approval"
        required
      />
      <Separator className="my-4" />
      <div className="w-full flex justify-between gap-2">
        <Button
          variant="outline"
          color="tertiary"
          onClick={() => closeStack()}
          disabled={isPendingPutSubmissionApproval}
        >
          Cancel
        </Button>
        <Button
          icon={<SendHorizontal className="size-4" />}
          type="submit"
          iconPosition="right"
          disabled={isPendingPutSubmissionApproval}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default ConfirmationRejectSubmission;
