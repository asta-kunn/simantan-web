import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import NotificationSuccess from "@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success";

const useSubmissionTask = ({
  submitService,
  archiveService,
  setDisableButton,
  navigate,
}) => {
  const { mutate: submitTask, isLoading: isSubmitting } = useMutation({
    mutationFn: submitService,
    onSuccess: async (data) => {
      try {
        if (!data.success) {
          if (setDisableButton) setDisableButton((prev) => !prev);
          return;
        }
        toast(
          <NotificationSuccess
            title="Successfully Submitted"
            description="Task has been submitted."
          />,
          {
            duration: 2000,
            action: {
              label: "Reload",
              onClick: () => window.location.reload(),
            },
          }
        );
        await setTimeout(() => {
          if (navigate) navigate("/master-data-management/approve-vendor-list");
        }, 2000);
      } catch (error) {
        if (setDisableButton) setDisableButton((prev) => !prev);
        console.log(error);
      }
    },
    onError: () => {
      if (setDisableButton) setDisableButton((prev) => !prev);
    },
  });

  // Mutasi untuk archive
  const { mutate: archiveTask, isLoading: isArchiving } = useMutation({
    mutationFn: archiveService,
    onSuccess: (data) => {
      if (data.success) {
        toast(
          <NotificationSuccess
            title="Successfully Archieved"
            description="Task has been archieved."
          />,
          {
            duration: 2000,
            action: {
              label: "Reload",
              onClick: () => window.location.reload(),
            },
          }
        );
        setTimeout(() => {
          if (navigate) navigate("/master-data-management/approve-vendor-list");
        }, 2000);
      } else {
        if (setDisableButton) setDisableButton((prev) => !prev);
      }
    },
    onError: () => {
      if (setDisableButton) setDisableButton((prev) => !prev);
    },
  });

  return {
    submitTask,
    archiveTask,
    isSubmitting,
    isArchiving,
  };
};

export default useSubmissionTask;
