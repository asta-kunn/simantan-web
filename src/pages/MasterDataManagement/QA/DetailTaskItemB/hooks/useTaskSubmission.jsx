import { useMutation } from "@tanstack/react-query";
import { apiSubmitToWaiting, apiRejectTask } from "@/services/master-data-management/item-b.service";
import NotificationSuccess from "@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useTaskSubmission = (setDisableButton) => {
    const navigate = useNavigate();

    const { mutate: submitQA } = useMutation({
        mutationFn: apiSubmitToWaiting,
        onSuccess: async (data) => {
            try {
                if (data.success) {
                    toast(<NotificationSuccess title="Successfully Approved" description="Task has been approved." />, {
                        duration: 2000,
                        action: {
                            label: "Reload",
                            onClick: () => window.location.reload(),
                        },
                    });
                    await setTimeout(() => { navigate("/master-data-management/approval-qa") }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        },
        onError: () => {
            setDisableButton(prev => !prev)
        }
    });

    const { mutate: rejectTask } = useMutation({
        mutationFn: apiRejectTask,
        onSuccess: async (data) => {
            try {
                if (data.success) {
                    toast(<NotificationSuccess title="Successfully Rejected" description="Task has been rejected." />, {
                        duration: 2000,
                        action: {
                            label: "Reload",
                            onClick: () => window.location.reload(),
                        },
                    });
                    await setTimeout(() => { navigate("/master-data-management/approval-qa") }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        },
        onError: () => {
            setDisableButton(prev => !prev)
        }
    });

    return {
        submitQA,
        rejectTask
    };
};

export default useTaskSubmission;