import { useMutation } from "@tanstack/react-query";
import { saveItemB, updateManufactureAddress } from "@/services/master-data-management/item-b.service";
import NotificationSuccess from "@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success";
import { toast } from "sonner";

const useItemBMutations = (setDisableButton) => {
    const { mutate: updateItemB } = useMutation({
        mutationFn: saveItemB,
        onSuccess: (data) => {
            if (!data.success) return;
            toast(<NotificationSuccess title="Successfully Saved" description="Task has been saved as a draft." />, {
                duration: 2000,
                action: {
                    label: "Reload",
                    onClick: () => window.location.reload(),
                },
            });
            setDisableButton(prev => !prev)
        },
        onError: () => {
            setDisableButton(prev => !prev)
        }
    });

    const { mutate: updateManufacturer } = useMutation({
        mutationFn: updateManufactureAddress,
        onSuccess: async (resp) => {
            try {
                if (resp.success) {
                    toast(<NotificationSuccess title="Successfully Updated" description="Manufacturer has been updated." />, {
                        duration: 2000,
                        action: {
                            label: "Reload",
                            onClick: () => window.location.reload(),
                        },
                    });
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
        updateItemB,
        updateManufacturer
    };
};

export default useItemBMutations;