import { Fragment } from "react"
import DetailSection from "./components/detail-section"
import useActionHandlerDetailInactivation from "./hooks/useActionHandlerDetailInactivation"
import DialogDetailInactiveManufacture from "../components/dialog-detail-inactive-manufacture"
import useStateHandlerDetailInactivation from "./hooks/useStateHandlerDetailInactivation"
import useFetchDetailInactiveManufacture from "./hooks/useFetchDetailInactiveManufacture"
import { formatDateMonth, formatTime } from "@/lib/utils"
import FooterInactiveDetailManufacturer from "./components/footer"
import useMutationApproval from "./hooks/useMutationApproval"
import DialogValidateLogin from "./components/dialog-validate-login"
import useValidateLogin from "./hooks/useValidateLogin"
import useFetchInactiveApproval from "./hooks/useFetchInactiveApproval"
import useMutationReactivateManufacture from "./hooks/useMutationReactivateManufacture"


const InactivationManufacturerDetail = () => {

    const {
        isOpenDialog,
        setIsOpenDialog,
        detailTaskId,
        isManager,
        loading,
        setLoading,
        setConfirmLogin,
        confirmLogin,
        type,
        setType,
        setSubmitOracleForm,
        submitOracleForm,
        openSheet
    } = useStateHandlerDetailInactivation();

    //fetch data
    const { data } = useFetchDetailInactiveManufacture(detailTaskId);
    const { dataApproval } = useFetchInactiveApproval(detailTaskId);

    //mutation
    const { approveInactive, rejectInactive, submitOracle } = useMutationApproval();
    const { reactive } = useMutationReactivateManufacture();
    const { submitValidateLogin } = useValidateLogin({ reactive, approveInactive, rejectInactive, detailTaskId, type, submitOracle, submitOracleForm, actionPlan: data?.ACTION_PLAN })


    const {
        goBack,
        inactiveHelper,
        popupConfirmLogin,
        handleConfirm,
        handleOpenSheet
    } = useActionHandlerDetailInactivation({
        loading,
        setLoading,
        approveInactive,
        rejectInactive,
        detailTaskId,
        setConfirmLogin,
        type,
        setType,
        submitValidateLogin,
        setSubmitOracleForm,
        data,
        openSheet,
        dataApproval
    });

    //fetch data



    return (
        <DetailSection
            data={data}
            handleOpenSheet={handleOpenSheet}
            handleOpenTableHistory={() => { }}
            mainContent={
                <Fragment>
                    <div className="p-4 bg-white rounded-b-md border">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row flex-wrap justify-start items-center space-y-2">
                                <div className="w-1/3">
                                    <p className="text-gray-500 text-md">Recipe Version</p>
                                    <p className="font-semibold text-md">V.{data?.ORA_RECIPE_VERSION}</p>
                                </div>

                                <div className="w-1/3">
                                    <p className="text-gray-500 text-md">Formula Version</p>
                                    <p className="font-semibold text-md">V.{data?.ORA_FORMULA_VERSION}</p>
                                </div>

                                <div className="w-1/3">
                                    <p className="text-gray-500 text-md">AVL Version</p>
                                    <p className="font-semibold text-md">V.{data?.AVL_FORMULA_VERSION}</p>
                                </div>

                                <div className="w-1/3">
                                    <p className="text-gray-500 text-md">MA/NIE No & Version</p>
                                    <p className="font-semibold text-md">{data?.REGISTRATION_NUMBER} - V.{data?.NIE_VERSION}</p>
                                </div>

                                <div className="w-1/3">
                                    <p className="text-gray-500 text-md">Infotehna Doc .No</p>
                                    <p className="font-semibold text-md">{data?.INFOTEHNA_DOCUMENT_NUMBER}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-start justify-start flex-row">
                                    <div className=" w-1/3">
                                        <p className="text-gray-500 text-md">Requester</p>
                                        <p className="font-semibold text-md">{data?.REQUESTOR}</p>
                                        <p className="text-gray-500 text-md">{data?.REQUESTOR_EMAIL}</p>
                                    </div>
                                    <div className="w-1/3">
                                        <p className="text-gray-500 text-md">Request Date</p>
                                        <p className="font-semibold text-md">{formatTime(data?.REQUEST_DATE)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-stone-100 rounded-md space-y-2 p-4 min-h-[40vh]">
                                <p className="text-xl font-semibold">Inactive Manufacturer</p>
                                <div className="bg-white p-4 rounded-md border-slate-300 border items-start justify-start flex flex-row">
                                    <div className="flex items-start justify-start flex-col w-1/3">
                                        <p className="text-gray-500 text-md">Item Material</p>
                                        <p className="font-semibold text-md">{data?.ITEM_MATERIAL}</p>
                                    </div>
                                    <div className="flex items-start justify-start flex-col w-1/3">
                                        <p className="text-gray-500 text-md">Manufacturer</p>
                                        <p className="font-semibold text-md">{data?.MANUFACTURER}</p>
                                    </div>
                                    <div className="flex items-start justify-start flex-col w-1/6">
                                        <p className="text-gray-500 text-md">Status</p>
                                        {inactiveHelper(data?.ACTION_PLAN)}
                                    </div>
                                    <div className="flex items-start justify-start flex-col 1/6">
                                        <p className="text-gray-500 text-md">Effective Date</p>
                                        <p className="font-semibold text-md">{formatDateMonth(data?.EFFECTIVE_DATE)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogDetailInactiveManufacture
                            isOpen={isOpenDialog}
                            onClose={() => { setIsOpenDialog(prev => !prev) }}
                            setIsOpenDetail={() => { setIsOpenDialog(prev => !prev) }}
                            detailItemA={[]}
                            isView={true}
                        />

                        <DialogValidateLogin
                            isOpen={confirmLogin}
                            onClose={() => { setConfirmLogin(prev => !prev) }}
                            setIsOpenDetail={() => { setConfirmLogin(prev => !prev) }}
                            detailItemA={[]}
                            isView={true}
                            type={type}
                            onSubmit={handleConfirm}
                            loading={loading}
                        />

                    </div>

                    <FooterInactiveDetailManufacturer
                        goBack={goBack}
                        isManager={isManager}
                        loading={loading}
                        handleApprove={() => { popupConfirmLogin("APPROVE") }}
                        handleReject={() => { popupConfirmLogin("REJECT") }}
                        handleReactivate={() => { popupConfirmLogin("REACTIVATE") }}
                        data={data}
                    />
                </Fragment>
            }
        />
    )
}

export default InactivationManufacturerDetail
