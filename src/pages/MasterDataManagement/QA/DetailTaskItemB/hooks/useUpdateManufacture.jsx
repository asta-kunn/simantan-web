import NotificationSuccess from '@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success';
import { updateManufactureAddress } from '@/services/master-data-management/item-b.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useUpdateManufacture = (setDisableButton) => {
    const { mutate } = useMutation({
        mutationFn: updateManufactureAddress,
        onSuccess: (data) => {
            if (!data.success) return;
            setDisableButton(false);
            toast(<NotificationSuccess title="Successfully Saved" description="Task has been saved as a draft." />, {
                duration: 2000,
                action: {
                    label: "Reload",
                    onClick: () => window.location.reload(),
                },
            });
           
        },
        onError: () => {
            setDisableButton(prev => !prev)
        }
    })

    return { mutate }
}

export default useUpdateManufacture
