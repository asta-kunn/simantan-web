import { Fragment } from "react";
import TableAccordionItemB from "./components/table-accordion-item-b";
import { TableItemAList } from "./components/table-item-a";
import SidebarFormUpdate from "./components/sidebar-form-update";
import Swal from "sweetalert2";
import { QAManufactureHistoryPopup } from "../DetailTask/components/manufacture-history-popup";
import DialogSubmitItemB from "../../TechnicalService/DetailTaskItemB/components/dialog-submit-item-b";
import TableViewItem from "../../TechnicalService/DetailTaskItemB/components/table-view-item";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import DetailSection from "../components/detail-section";
import { TableHistoryPopup } from "../components/table-history-popup";
import { FooterItemB } from "./components/footer-item-b";
import useGetDataCountry from "./hooks/useGetDataCountry";
import useGetDetailItemB from "./hooks/useGetDetailItemB";
import useManufacturerHistory from "./hooks/useManufacturerHistory";
import useApprovalHistory from "./hooks/useApprovalHistory";
import useValidateLogin from "./hooks/useValidateLogin";
import useTaskSubmission from "./hooks/useTaskSubmission";
import useUpdateManufacture from "./hooks/useUpdateManufacture";
import useDetailTaskQAHandleFunction from "./hooks/useDetailTaskQAHandleFunction";
import SkeletonDetail from "../../TechnicalService/DetailTaskItemB/components/skeleton-detail";
import { formatChildren, formatChildrenView } from "./helpers/generate-children";
import useDetailTaskItemBStateHandler from "./hooks/useDetailTaskQAHandler";

const DetailTaskItemB = () => {
    const {
        detailId,
        rawmatList,
        setRawmatList,
        disableButton,
        setDisableButton,
        isOpen,
        setIsOpen,
        editedItem,
        setEditedItem,
        notes,
        setNotes,
        openTableHistory,
        setOpenTableHistory,
        manufacturePopup,
        setManufacturePopup,
        dialog,
        setDialog,
        historyChanges,
        setHistoryChanges,
        title,
        setTitle,
        dataVersion,
        setDataVersion,
        openSheet,
        detailType,
        navigate
    } = useDetailTaskItemBStateHandler();

    const { dataCountry } = useGetDataCountry();
    const { isPending, detailItemB } = useGetDetailItemB({
        detailType,
        detailId,
        setRawmatList,
        setTitle,
        setDataVersion,
        formatChildrenView,
        formatChildren,
        title
    })
    const { mutateHistory } = useManufacturerHistory(setHistoryChanges);
    const { dataApproval } = useApprovalHistory(detailId);
    const { submitQA } = useTaskSubmission(setDisableButton);
    const { rejectTask } = useTaskSubmission(setDisableButton);
    const { submitValidateLogin } = useValidateLogin(setDialog, setDisableButton, submitQA, rejectTask, detailId, notes, detailItemB, rawmatList, dialog);
    const { mutate: updateManuf } = useUpdateManufacture(setDisableButton);

    const { handleChangeDataTable, handleOpenTableHistory, handleOpenSheet, onSubmitItem, handleSubmitItem, handleFetchHistory } = useDetailTaskQAHandleFunction({
        setOpenTableHistory,
        openSheet,
        setDialog,
        setNotes,
        submitValidateLogin,
        setRawmatList,
        setManufacturePopup,
        mutateHistory,
        dataApproval,
        dialog,
        setDisableButton,
    });


    if (isPending) {
        return (
            <Fragment>
                <DetailSection
                    data={null}
                    handleOpenSheet={() => { }}
                    handleOpenTableHistory={() => { }}
                    mainContent={
                        <Fragment>
                            <div className="px-4 bg-white flex items-center justify-between w-full">
                                <div className="pt-6">
                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                </div>
                            </div>
                            <div className="p-4">
                                <SkeletonDetail />
                            </div>
                            <div className="p-4">
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                            </div>
                            <div className="p-4">
                                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </Fragment>
                    }
                />
            </Fragment>
        )
    }


    return (
        <Fragment>
            <DetailSection
                data={detailItemB}
                handleOpenSheet={handleOpenSheet}
                handleOpenTableHistory={handleOpenTableHistory}
                mainContent={
                    <Fragment>
                        <div className="px-4 bg-white flex items-center justify-between w-full">
                            <div className="pt-6">
                                <p className="font-semibold">Daftar Produk</p>
                            </div>
                        </div>
                        <div className="p-4">
                            {detailType === EDITABLE_ENUM.Editable ? (
                                <TableAccordionItemB
                                    data={detailItemB}
                                    dataVersion={dataVersion}
                                    rawmatList={rawmatList}
                                    setIsOpenHistory={async (e) => {
                                        setManufacturePopup({ ...e })
                                        await mutateHistory({ manufId: e.data });
                                    }}
                                    handleOpenSheet={(value) => {
                                        setEditedItem({
                                            mapping_id: {
                                                item_id: value.rawmatId,
                                                child_id: value.childId,
                                                subchild_id: value.subchildId
                                            },
                                            stick_value: { ...value.value.current_value },
                                            change_value: { ...value.value.update_value }
                                        })
                                        setIsOpen(prev => !prev);
                                    }}
                                    title={title}
                                    editable={true}
                                />) :
                                (
                                    <TableViewItem
                                        data={rawmatList}
                                        regType={title.registration_type}
                                        setIsOpenHistory={async (e) => {
                                            await handleFetchHistory(e);
                                        }}
                                        dataVersion={dataVersion}
                                        navigate={() => {
                                            navigate(-1)
                                        }}
                                        title={title}
                                    />
                                )
                            }
                        </div>

                        <QAManufactureHistoryPopup
                            setIsOpen={() => {
                                setManufacturePopup(prev => ({ ...prev, isOpen: !prev.isOpen }))
                            }}
                            isOpen={manufacturePopup.isOpen}
                            data={historyChanges}
                            onClose={() => { setManufacturePopup(prev => ({ ...prev, isOpen: false })) }}
                        />

                        <TableHistoryPopup
                            isOpen={openTableHistory}
                            setIsOpen={setOpenTableHistory}
                            onClose={() => setOpenTableHistory(false)}
                            data={historyChanges}
                        />

                        <DialogSubmitItemB
                            dialog={dialog}
                            type={dialog.type}
                            setDialog={setDialog}
                            onSubmit={async (values) => { await handleSubmitItem(values) }}
                        />

                        <SidebarFormUpdate
                            isOpen={isOpen}
                            editedItem={editedItem}
                            onClose={() => { setIsOpen(false) }}
                            setChangeValue={async (value) => {
                                Swal.fire({
                                    title: 'Info',
                                    icon: 'info',
                                    text: 'Are you sure want to save manufacturer address ?',
                                    showCancelButton: true
                                }).then(async res => {
                                    if (res.isConfirmed) {
                                        try {
                                            await updateManuf({
                                                manuf_code: value.manuf_code,
                                                update_value: { ...value.update_value },
                                                current_value: { ...value.stick_value }
                                            });
                                            handleChangeDataTable({
                                                accordion_id: value['accordion_id'],
                                                child_id: value['child_id'],
                                                subchild_id: value['subchild_id'],
                                                value: value['update_value']
                                            })
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }
                                })
                            }}
                            country={dataCountry || []}
                        />

                        {
                            detailItemB && detailItemB['SEGMENT'] === 'B' && (
                                <TableItemAList data={detailItemB && detailItemB['ITEM_A_LIST']} />
                            )
                        }

                        <FooterItemB
                            isEditable={detailType === EDITABLE_ENUM.Editable}
                            loading={disableButton}
                            onSave={() => { }}
                            onSubmit={onSubmitItem}
                            back={() => { navigate(-1) }}
                        />

                    </Fragment>
                }
            />
        </Fragment>
    )

}

export default DetailTaskItemB