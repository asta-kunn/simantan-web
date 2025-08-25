import { useNavigate } from "react-router-dom";
import ApprovalHistory from "../components/inactive-approval-history";

const useActionHandlerDetailInactivation = ({
    setLoading, approveInactive, rejectInactive, detailTaskId, setConfirmLogin,
    setType, submitValidateLogin, setSubmitOracleForm, data, openSheet, dataApproval
}) => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const inactiveHelper = (status) => {
        if (status === 'Inactive Request' || status === 'Reactivation Request') {
            return <span className="font-semibold text-sm bg-blue-100 px-1 rounded-full text-blue-500 border border-blue-500">{status}</span>
        }else if (status === 'Inactivation') {
            return <span className="font-semibold text-sm bg-rose-100 px-1 rounded-full text-rose-500 border border-rose-500">{status}</span>
        }
        else if(status === 'Reactivation') {
            return <span className="font-semibold text-sm bg-green-100 px-1 rounded-full text-green-500 border border-green-500">{status}</span>
        }
    }

    const handleApprove = async () => {
        try {
            setLoading(true);
            await approveInactive(detailTaskId);
        } catch (error) {
            console.log(error, 'ERROR')
        } finally {
            let timeout = setTimeout(() => {
                setLoading(false);
            }, 1000)
            clearTimeout(timeout);
        }
    }

    const handleReject = async () => {
        try {
            setLoading(true);
            await rejectInactive(detailTaskId);
        } catch (error) {
            console.log(error, 'ERROR')
        } finally {
            let timeout = setTimeout(() => {
                setLoading(false);
            }, 1000)
            clearTimeout(timeout);
        }
    }

    const popupConfirmLogin = (type) => {
        setConfirmLogin(prev => !prev)
        setType(type)
    }


    const handleConfirm = async (values) => {
        try {
            setLoading(true);
            setSubmitOracleForm(
                {
                    eff_date_to: data['ACTION_PLAN'].includes('Inactive Request') ? data['EFFECTIVE_DATE'].split("T")[0] : null,
                    organization_code: data['ORG_CODE'],
                    fg_number: data['ITEM_FG_NUMBER'],
                    manufacture_code: data['MANUFACTURE_CODE'],
                    material_number: data['ITEM_RM_NUMBER'],
                    avl_version: data['AVL_FORMULA_VERSION'],
                    formula_no: data['FORMULA_NO'],
                    formula_version: data['ORA_FORMULA_VERSION'],
                    recipe_no: data['RECIPE_NO'],
                    recipe_version: data['ORA_RECIPE_VERSION']
                }
            );
            await submitValidateLogin(values);
        } catch (error) {
            console.log(error, 'ERROR')
        }
    }

    const handleOpenSheet = () => {
        openSheet({
          title: "Approval History",
          description: "View detailed approval history for this item.",
          width: "md",
          children: (
            <ApprovalHistory dataApproval={dataApproval} />
          )
        })
      }



    return {
        goBack,
        inactiveHelper,
        handleApprove,
        handleReject,
        popupConfirmLogin,
        handleConfirm,
        handleOpenSheet
    }
}

export default useActionHandlerDetailInactivation
