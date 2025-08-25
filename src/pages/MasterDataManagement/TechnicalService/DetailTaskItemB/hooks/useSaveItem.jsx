import { useMutation } from "@tanstack/react-query";
import { saveItemB } from "@/services/master-data-management/item-b.service";
import NotificationSuccess from "@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success";
import { toast } from "sonner";

const useSaveItem = (setDisableButton) => {
    const { mutate: saveItem } = useMutation({
        mutationFn: saveItemB,
        onSuccess: (data) => {
            if (!data.success) return;
            toast(
                <NotificationSuccess
                    title="Successfully Saved"
                    description="Task has been saved as a draft."
                />,
                {
                    duration: 2000,
                    action: {
                        label: "Reload",
                        onClick: () => window.location.reload(),
                    },
                }
            );
            if (setDisableButton) setDisableButton(prev => !prev);
        },
        onError: () => {
            if (setDisableButton) setDisableButton(prev => !prev);
        }
    });

    return { saveItem };
};

export default useSaveItem;
