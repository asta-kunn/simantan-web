import { validateFormLogin } from "@/services/master-data-management/item-b.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";     

const useValidateLogin = ({
    type,
    approveInactive,
    rejectInactive,
    detailTaskId,
    setLoading,
    submitOracle,
    submitOracleForm,
    actionPlan,
    reactive
}) => {
    const { mutate: submitValidateLogin } = useMutation({
        mutationFn: validateFormLogin,
        onSuccess: async (data) => {
            try {
                if (data.success) {
                    if (type === 'APPROVE') {
                        await approveInactive({
                            task_id: detailTaskId,
                            action_plan: actionPlan,
                        });
                        await submitOracle(submitOracleForm);
                    }else if(type === 'REACTIVATE') {
                        await reactive(detailTaskId);
                    }else {
                        await rejectInactive({
                            task_id: detailTaskId,
                            action_plan: actionPlan,
                        });
                    }
                } else {
                    toast.error("Email atau password yang Anda masukkan salah. Silakan coba lagi.", {
                        description: "Pastikan email dan password sudah benar. Jika lupa password, hubungi admin.",
                        duration: 3000,
                        icon: "🔒",
                        action: {
                            label: "Muat Ulang",
                            onClick: () => window.location.reload(),
                        },
                        style: {
                            background: "#fff3cd",
                            color: "#856404",
                            border: "1px solid #ffeeba"
                        }
                    });
                    return;
                }
            } catch (error) {
                console.log(error, 'ERROR')
            }
        },
        onError: () => {
            setLoading(false)
        }
    });

    return { submitValidateLogin };
};

export default useValidateLogin;