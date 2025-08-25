// Third-party libraries
import { SendHorizontal } from "lucide-react";
import dayjs from "dayjs";

// Components
import ApprovableLetterForm from "@/pages/ProductRegistration/NewProductRegistration/Submission/Detail/components/ApprovableLetterForm";

// Stores
import { useUIStore } from "@/stores/uiStore";

// Constants and schemas
import { submissionSchemas } from "@/pages/ProductRegistration/RegistrationVariationNotification/pages/Submission/Detail/schemas/submission";
import { usePutEditMarketingAuthorization } from "../../hooks/useDocumentApproval";

/** Hooks */
import { useFile } from "@/hooks/file/useFile";
import { projectTaskCode } from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";

const ModalEditMarketingAuthorization = ({
  submission,
  refetch,
  onOpenFile,
}) => {
  const { setLoader, addStack, closeStack, clearStacks } = useUIStore();

  const {
    mutateAsync: putEditMarketingAuthorization,
    isPending: isPendingPutEditMarketingAuthorization,
  } = usePutEditMarketingAuthorization();

  const { uploadFileChunk } = useFile();
  const formatDate = (date) => date ? dayjs(date).format("YYYY-MM-DD") : null;
  const setDateDefault = (date) => date ? new Date( date) : null;

  const handleSubmitEditMA = async (data) => {
    try {
      setLoader(true);
      let additionalObject = {};

      if (
        typeof data?.MARKETING_AUTHORIZATION_FILE === "object" ||
        (Array.isArray(data?.MARKETING_AUTHORIZATION_FILE) &&
          data?.MARKETING_AUTHORIZATION_FILE?.length > 0)
      ) {
        const file = data?.MARKETING_AUTHORIZATION_FILE;
        const fileExtension = file?.name?.split(".").pop();

        const uploadResponse = await uploadFileChunk({
          file,
          fileName: `NIE-${submission?.FINISHED_PRODUCT_CODE}-${submission?.SUBMISSION_NO}.${fileExtension}`,
          docType: "NIE",
          versioning: "Y",
        });

        additionalObject = {
          MARKETING_AUTHORIZATION_FILE: uploadResponse.filePath,
          newObjectVersion: uploadResponse.version,
        };
      }

      await putEditMarketingAuthorization({
        ...data,
        INITIAL_REGISTRATION_DATE: formatDate(data?.INITIAL_REGISTRATION_DATE),
        NIE_MA_APPROVAL_DATE: formatDate(data?.NIE_MA_APPROVAL_DATE),
        NIE_MA_EXPIRY_DATE: formatDate(data?.NIE_MA_EXPIRY_DATE),
        ...(additionalObject?.MARKETING_AUTHORIZATION_FILE
          ? { ...additionalObject }
          : {}),
        MARKETING_AUTHORIZATION_ID: submission?.ONGOING_MARKETING_AUTHORIZATION?.MARKETING_AUTHORIZATION_ID,
        SUBMISSION_ID: submission?.SUBMISSION_ID,
      });

      await refetch();
      clearStacks();

      addStack({
        title: "Successfully Edited Marketing Authorization (NIE) Submission Result",
        description: "Well done! Please submit review to the next step.",
        variant: "success",
        isConfirm: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleMarketingAuthorizationNieEditSubmission = async (data) => {
    addStack({
      type: "modal",
      title: "Edit Marketing Authorization (NIE) Submission Result?",
      description: (
        <>
          Please review again because this action cannot be undone.
          <br />
          The form will continue to the next step.
        </>
      ),
      variant: "warning",
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm & Submit
          <SendHorizontal className="size-4" />
        </div>
      ),
      isLoading: isPendingPutEditMarketingAuthorization,
      onCancel: () => closeStack(),
      onConfirm: async () => await handleSubmitEditMA(data),
    });
  };

  return (
    <ApprovableLetterForm
      taskCode={projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT}
      defaultValues={{
        ...submission?.ONGOING_MARKETING_AUTHORIZATION,
        ADDITIONAL_COMMITMENTS: submission?.ONGOING_MARKETING_AUTHORIZATION?.ADDITIONAL_COMMITMENTS?.map(item => ({
          ...item,
          DUE_DATE: new Date(item?.DUE_DATE),
        })),
        INITIAL_REGISTRATION_DATE: setDateDefault(submission?.ONGOING_MARKETING_AUTHORIZATION?.INITIAL_REGISTRATION_DATE),
        NIE_MA_APPROVAL_DATE: setDateDefault(submission?.ONGOING_MARKETING_AUTHORIZATION?.NIE_MA_APPROVAL_DATE),
        NIE_MA_EXPIRY_DATE: setDateDefault(submission?.ONGOING_MARKETING_AUTHORIZATION?.NIE_MA_EXPIRY_DATE),
      }}
      schema={submissionSchemas?.marketingAuthorizationNieSubmissionForm}
      submitHandler={handleMarketingAuthorizationNieEditSubmission}
      actions={{ onOpenFile, closeModalForm: () => closeStack() }}
    />
  );
};

export default ModalEditMarketingAuthorization;
