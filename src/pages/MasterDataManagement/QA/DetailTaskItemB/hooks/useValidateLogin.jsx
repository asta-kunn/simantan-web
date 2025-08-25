import { useMutation } from "@tanstack/react-query";
import { validateFormLogin } from "@/services/master-data-management/item-b.service";
import { toast } from "sonner";     

const useValidateLogin = (setDialog, setDisableButton, submitQA, rejectTask, detailId, notes, detailItemB, rawmatList, dialog) => {
    const { mutate: submitValidateLogin } = useMutation({
        mutationFn: validateFormLogin,
        onSuccess: async (data) => {
            try {
                if (data.success) {
                    if (dialog.type === 'APPROVE') {
                        setDialog(prev => ({ ...prev, approve: false }))
                        await submitQA({
                            formula_id: detailId,
                            notes: notes,
                            item_fg_number: detailItemB['ITEM_FG_NUMBER'],
                            item_fg_id: detailItemB['ITEM_FG_ID'],
                            nie_number: detailItemB['REGISTRATION_NUMBER'],
                            nie_version: detailItemB['NIE_VERSION'],
                            nie_object_number: detailItemB['NIE_OBJECT_NUMBER'],
                            latest_nie_approval: detailItemB['LATEST_NIE_APPROVAL'],
                            avl_version: detailItemB['AVL_FORMULA_VERSION'],
                            org_code: detailItemB['ORG_CODE'],
                            recipe_no: detailItemB['RECIPE_NO'],
                            recipe_version: detailItemB['ORA_RECIPE_VERSION'],
                            registration_type: detailItemB['REGISTRATION_TYPE'],
                            formula_version: detailItemB['ORA_FORMULA_VERSION'],
                            formula_number: detailItemB['FORMULA_NO'],
                            list: rawmatList
                        });
                    } else {
                        setDialog(prev => ({ ...prev, approve: false }))
                        await rejectTask({ formula_id: detailId, notes: notes, item_fg_number: detailItemB['ITEM_FG_NUMBER'] });
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
            setDisableButton(prev => !prev)
        }
    });

    return { submitValidateLogin };
};

export default useValidateLogin;