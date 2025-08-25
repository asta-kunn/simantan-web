import { validateFormLogin } from "@/services/master-data-management/item-b.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import authStore from "@/stores/authStore";

const useValidateLoginInactiveInitialForm = ({
    saveData,
    setLoading,
    setManufacturer,
    setItemMaterial,
    setInactiveDate,
    manufacturer,
    selectedItemFG,
    itemMaterial,
    inactiveDate
}) => {
    const user = authStore(state => state.user)

    const { mutate: submitValidateLogin } = useMutation({
        mutationFn: validateFormLogin,
        onSuccess: async (data) => {
            try {
                if (data.success) {
                    await handleInsert()
                } else {
                    toast.error("The email or password you entered is incorrect. Please try again.", {
                        description: "Make sure your email and password are correct. If you forgot your password, contact admin.",
                        duration: 3000,
                        icon: "🔒",
                        action: {
                            label: "Reload",
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

    const handleInsert = async () => {
        setLoading(true)
        try {
            const payload = {
                MANUFACTURE_CODE: manufacturer.split(" - ")[0],
                MANUFACTURE_NAME: manufacturer.split(" - ")[1],
                ITEM_FG_NUMBER: selectedItemFG.split(" - ")[0],
                ITEM_FG_DESCRIPTION: selectedItemFG.split(" - ")[1],
                ITEM_RM_NUMBER: itemMaterial.split(" - ")[0],
                ITEM_RM_DESCRIPTION: itemMaterial.split(" - ")[1],
                AVL_VERSION: selectedItemFG.split(" - ")[2],
                MANUFACTURING_SITE: "DEXA MEDICA, PT",
                EFFECTIVE_DATE: inactiveDate,
            }

            await saveData(payload);

            setManufacturer(null)
            setItemMaterial(null)
            setInactiveDate(null)

        } catch (error) {
            console.error(error, 'ERROR')
            setManufacturer(null)
            setItemMaterial(null)
            setInactiveDate(null)
        }
    }

    const submitValidateUser = async (value) => {
        try {
            const payload = {
                email: value.email,
                password: value.password,
                notes: value.notes
            }
            if(user.EMAIL === value.email) {
                await submitValidateLogin(payload)
            } else {
                toast.error("Email does not match the email you used to login.", {
                    description: "Make sure the email you entered is correct. If you forgot your password, contact admin.",
                    duration: 3000,
                    icon: "🔒",
                    action: {
                        label: "Reload",
                        onClick: () => window.location.reload(),
                    },
                });
                return;
            }
        } catch (error) {
            console.error(error, 'ERROR')
        }
    }

    return { submitValidateUser };
};

export default useValidateLoginInactiveInitialForm;