import { archiveItemBService, submitItemBManufacturer, validateFormLogin } from "@/services/master-data-management/item-b.service";
import techServiceStore from "@/stores/techServiceStore";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import TableAccordionItemB from "./components/table-accordion-item-b";
import { FooterItemB } from "./components/footer-item-b";
import { TableItemAList } from "./components/table-item-a";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import DialogSubmitItemB from "./components/dialog-submit-item-b";
import SectionRegType from "./components/section-reg-type";
import { QAManufactureHistoryPopup } from "../../QA/DetailTask/components/manufacture-history-popup";
import TableViewItem from "./components/table-view-item";
import { validateManufacturerSegments, validateRegistrationType, validateSegments } from "./validation/index";
import SkeletonDetail from "./components/skeleton-detail";
import authStore from "@/stores/authStore";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import DetailSection from "../../QA/components/detail-section";
import useGetHistoryManufacture from "./hooks/useGetHistoryManufacture";
import useGetItemDetail from "./hooks/useGetItemDetail";
import useSaveItem from "./hooks/useSaveItem";
import useSubmissionTask from "./hooks/useSubmissionTask";
import useSubmitValidateLogin from "./hooks/useSubmitValidateLogin";
import ApprovalHistory from "../../QA/DetailTaskItemB/components/approval-history";
import { useUIStore } from "@/stores/uiStore";
import useApprovalHistory from "../../QA/DetailTaskItemB/hooks/useApprovalHistory";
import IntermediateMaterialsPopup from "./components/intermediate-materials-popup";
import useGetIntermediateItemList from "./hooks/useGetIntermediateItemList";


const DetailTaskItemB = () => {
    const [disableButton, setDisableButton] = useState(false);
    const [dialog, setDialog] = useState({
        approve: false,
        type: 'APPROVE'
    })
    const [notes, setNotes] = useState("");
    const navigate = useNavigate();
    const [manufacturePopup, setManufacturePopup] = useState({
        isOpen: false,
        data: null
    });
    const [intermediateMaterialsPopup, setIntermediateMaterialsPopup] = useState({
        isOpen: false,
        data: null
    });
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [intermediateItemId, setIntermediateItemId] = useState(null);

    const { openSheet } = useUIStore();

    //store
    const user = authStore((state) => state.user);
    const detailId = techServiceStore((state) => state.detailId);
    const detailType = techServiceStore(state => state.detailType)

    //option
    const filterOptions = [
        { value: "Variation", label: "Variation" },
        { value: "Notification", label: "Notification" },
        { value: "No Registration", label: "No Registration" },
    ];

    //api function
    const { historyChanges, mutateHistory } = useGetHistoryManufacture();
    const { detailItemB, rawmatList, title, dataVersion, setRawmatList, setTitle } = useGetItemDetail(detailId);
    const { intermediateItemList, intermediateDataHeader } = useGetIntermediateItemList(intermediateItemId);
    const { saveItem } = useSaveItem(setDisableButton)
    const { submitTask, archiveTask } = useSubmissionTask({
        submitService: submitItemBManufacturer,
        archiveService: archiveItemBService,
        setDisableButton,
        navigate,
    });
    const { submitValidateLogin } = useSubmitValidateLogin({
        validateFormLogin,
        dialog,
        setDialog,
        archiveTask,
        submitTask,
        detailId,
        notes,
        detailItemB,
        rawmatList,
        title,
        setDisableButton,
    });
    const { dataApproval } = useApprovalHistory(detailId);


    const handleFetchHistory = async (e) => {
        try {
            setManufacturePopup({ ...e })
            await mutateHistory({ manufId: e.data });
        } catch (error) {
            console.log(error, 'ERROR')
        }
    }

    const handleCheckboxChange = ({
        rawmatId,
        childId,
        subChildId,
        checked
    }) => {
        setRawmatList(prevData => {
            const newData = [...prevData];

            const itemIndex = newData.findIndex(item => item.id === rawmatId);
            if (itemIndex === -1) return prevData;

            const childIndex = newData[itemIndex].children.findIndex(child => child.id === childId);
            if (childIndex === -1) return prevData;

            if (subChildId < 0 || subChildId >= newData[itemIndex].children[childIndex].subchild.length) {
                return prevData;
            }

            const updatedSubchild = [...newData[itemIndex].children[childIndex].subchild];
            updatedSubchild[subChildId] = {
                ...updatedSubchild[subChildId],
                isChecked: checked
            };

            newData[itemIndex].children[childIndex] = {
                ...newData[itemIndex].children[childIndex],
                subchild: updatedSubchild
            };

            return newData;
        });
    };

    const handleSaveItem = async () => {
        setDisableButton(true);
        try {
            const modify_array = [];
            rawmatList.forEach(item => {
                if (item['children'].length < 1) return
                if (item['id'] === 'INTERMEDIATE_MATERIALS') return
                modify_array.push(item);
            })

            await saveItem({
                formula_id: detailId,
                mapping_information: title,
                manufacturer: modify_array
            });
        } catch (error) {
            setDisableButton(prev => !prev)
            console.log(error, 'error save')
        }
    }

    const onSubmitItem = (type) => {
        try {
            setDialog({ ...dialog, approve: true, type: type })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitItem = async (values) => {
        setDisableButton(true);

        try {
            setNotes(values.notes);
            if (user.EMAIL !== values.email) {
                setDisableButton(false)
                toast.error("Wrong email used for submission", {
                    description: "Please use your own email to submit this task.",
                    duration: 2000,
                    style: {
                        background: "#fff3cd",
                        color: "#856404",
                        border: "1px solid #ffeeba"
                    }
                });
                return;
            }

            if (dialog.type === 'ARCHIVE') {
                await submitValidateLogin({
                    email: values.email,
                    password: values.password,
                    notes: values.notes
                })
                return;
            }

            if (!validateManufacturerSegments(rawmatList)) {
                setDisableButton(false)
                return;
            }

            if (!validateRegistrationType({ title, dataVersion, type: dialog.type })) {
                setDisableButton(false)
                return;
            }

            if (!validateSegments(rawmatList)) {
                setDisableButton(false)
                return;
            }

            await submitValidateLogin({
                email: values.email,
                password: values.password,
                notes: values.notes
            })
        } catch (error) {
            setDisableButton(prev => !prev)
            console.log(error, 'error save')
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


    if (!detailItemB) {
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
        <motion.div
            className="min-h-screen bg-gray-50  mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <DetailSection
                data={detailItemB}
                handleOpenSheet={handleOpenSheet}
                handleOpenTableHistory={() => { }}
                mainContent={
                    <Fragment>
                        <QAManufactureHistoryPopup
                            setIsOpen={() => {
                                setManufacturePopup(prev => ({ ...prev, isOpen: !prev.isOpen }))
                            }}
                            isOpen={manufacturePopup.isOpen}
                            data={historyChanges}
                            onClose={() => { setManufacturePopup(prev => ({ ...prev, isOpen: false })) }}
                        />

                        <IntermediateMaterialsPopup
                            isOpen={intermediateMaterialsPopup.isOpen}
                            onClose={() => { setIntermediateMaterialsPopup(prev => ({ ...prev, isOpen: false })) }}
                            data={intermediateItemList}
                            dataHeader={intermediateDataHeader}
                        />

                        {
                            detailType === EDITABLE_ENUM.Editable ? (
                                <div>
                                    <div className="px-4 bg-white flex items-center justify-between w-full">
                                        <div className="pt-6">
                                            <p className="font-semibold text-lg">Daftar Produk</p>
                                        </div>
                                    </div>
                                    <div className={`${title.segment === 'B' ? 'hidden' : ''}`}>
                                        <SectionRegType
                                            onChangeRegType={(value) => { setTitle({ ...title, registration_type: value }) }}
                                            regType={title.registration_type}
                                            filterOptions={filterOptions}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <TableAccordionItemB
                                            data={detailItemB}
                                            rawmatList={rawmatList}
                                            onChange={handleCheckboxChange}
                                            dataVersion={dataVersion}
                                            file={detailItemB && detailItemB['FILE_DOCUMENT_NIE']}
                                            title={title}
                                            setIntermediateItemId={(e) => {
                                                setIntermediateItemId(e)
                                                setIntermediateMaterialsPopup(prev => ({ ...prev, isOpen: true }))
                                            }}
                                        />
                                    </div>
                                    <TableItemAList data={detailItemB && detailItemB['ITEM_A_LIST']} />
                                    <DialogSubmitItemB
                                        type={dialog.type}
                                        onSubmit={async (values) => { await handleSubmitItem(values) }}
                                        setDialog={(value) => { setDialog({ ...value }) }}
                                        dialog={dialog}
                                        onChangeNotes={(value) => { setNotes(value) }}
                                        email={form.email}
                                        password={form.password}
                                        changeForm={(e) => {
                                            setForm({ ...form, [e.target.name]: e.target.value })
                                        }}
                                    />
                                    <FooterItemB
                                        loading={disableButton}
                                        onSave={handleSaveItem}
                                        onSubmit={onSubmitItem}
                                        back={() => { navigate(-1) }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <TableViewItem
                                        title={title}
                                        data={rawmatList}
                                        regType={title.registration_type}
                                        setIsOpenHistory={async (e) => {
                                            await handleFetchHistory(e);
                                        }}
                                        dataVersion={dataVersion}
                                        file={detailItemB && detailItemB['FILE_DOCUMENT_NIE']}
                                    />
                                    <div className="px-4 pb-4">
                                        <FooterItemB
                                            loading={disableButton}
                                            onSave={handleSaveItem}
                                            onSubmit={onSubmitItem}
                                            back={() => { navigate(-1) }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </Fragment>
                }
            />

        </motion.div>
    )
}

export default DetailTaskItemB