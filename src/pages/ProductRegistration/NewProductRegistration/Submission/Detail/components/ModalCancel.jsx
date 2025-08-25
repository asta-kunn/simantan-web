import {
  Button,
  Form,
  Separator,
  TextArea,
  Uploader,
} from "@/components/Dexain";
import { useFile } from "@/hooks/file/useFile";
import { useUIStore } from "@/stores/uiStore";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { usePatchCancelSubmission } from "../../../hooks/useNewRegSubmission";

const ModalCancel = ({ submission, refetch }) => {
  const navigate = useNavigate();
  const { uploadFileChunk } = useFile();
  const { cancelSubmission } = usePatchCancelSubmission();
  const { addStack, closeStack, clearStacks } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);

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

      await refetch();
      closeStack();

      addStack({
        type: "modal",
        title: "Succesfully Cancelled Registration Submission",
        description: "Well done! Registration submission dropped on the latest process.",
        variant: "success",
        footer: (
          <>
            <div className="flex flex-col mb-2">
              <Button
                onClick={() => {
                  navigate("/product-registration/new");
                  clearStacks();
                }}
              >
                Back to My Task
              </Button>
            </div>
            <div className="flex flex-col">
              <Button
                variant="outline"
                onClick={() => {
                  clearStacks();
                  refetch();
                }}
              >
                View Task Detail
              </Button>
            </div>
          </>
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

export default ModalCancel;
