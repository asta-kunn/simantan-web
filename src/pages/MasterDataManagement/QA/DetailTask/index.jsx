import React, { Fragment, useEffect, useRef, useState, useCallback } from "react";
import TableWithAccordion from "./components/table-with-accordion";
import { useNavigate } from "react-router-dom";
import TSFooterButton from "./components/entire-footer-button";
import FormEditDrawer from "./components/form-edit-drawer";
import { useFetchAPI } from "@/hooks/use-fetch-api";
import techServiceStore from "@/stores/techServiceStore";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { detailTSInitialValue } from "../../TechnicalService/DetailTaskItemB/constants/initial-value";
import { initialManufacture } from "./constants/qa-initial-value";
import { motion } from "framer-motion";
import { useMutation } from "@/hooks/use-mutation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useTimeoutAsync } from "@/hooks/use-timeout";
import Swal from "sweetalert2";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import TableViewQA from "./components/table-view-qa";
import { ApprovalInfoCard } from "./components/approval-info-card";
import STATUS_APPROVE from "./constants/qa-status-approve";
import TableHistory from "@/components/form/table-history";
import { insertAVL, submitTaskQA, fetchDetailTaskQA, fetchContries, fetchTaskHistoryQA, fetchApprovalHistoryQA, fetchHistoryManufacture } from "@/services/master-data-management/qa.service";
import authStore from "@/stores/authStore";
import USER_TYPE from "@/constants/user-type.constant";
import { QAManufactureHistoryPopup } from "./components/manufacture-history-popup";
import { useUIStore } from "@/stores/uiStore";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const formatChildren = (data, setRejectedActive) => {
  if (!data) return []

  return data.map((task) => {
    return {
      id: task.RAWMAT_ID,
      item_rm_id: task.ITEM_RM_ID,
      name: `${task.ITEM_RM_NUMBER} - ${task.ITEM_RM_DESC}`,
      subchild: task.MANUFACTURER.map((manufacture) => {

        if (!manufacture.SUBMITED_DATE && !task.ITEM_RM_NUMBER.startsWith("B-")) {
          setRejectedActive(true)
        }

        const is_checked = task.ITEM_RM_NUMBER.startsWith("B-") ? true : manufacture.IS_ACTIVE == "YES" ? true : false;

        return {
          stick_value: {
            id: manufacture.MANUF_ID,
            manufacturing_source: manufacture.MANUF_NAME,
            manufacturing_code: manufacture.MANUF_CODE,
            address: `${manufacture.ADDRESS_LINE1}, ${manufacture.ADDRESS_LINE2 ?? "-"}, ${manufacture.POSTAL_CODE ?? "-"}, ${manufacture.CITY ?? "-"}, ${manufacture.COUNTRY ?? "-"}`,
            address_line1: manufacture.ADDRESS_LINE1 ?? "",
            address_line2: manufacture.ADDRESS_LINE2 ?? "",
            postal_code: manufacture.POSTAL_CODE ?? "",
            city: manufacture.CITY ?? "",
            country: manufacture.COUNTRY ?? "",
            isChecked: is_checked
          },
          change_value: {
            id: manufacture.MANUF_ID,
            manufacturing_source: manufacture.MANUF_NAME,
            manufacturing_code: manufacture.MANUF_CODE,
            address: `${manufacture.ADDRESS_LINE1}, ${manufacture.ADDRESS_LINE2 ?? "-"}, ${manufacture.POSTAL_CODE ?? "-"}, ${manufacture.CITY ?? "-"}, ${manufacture.COUNTRY ?? "-"}`,
            address_line1: manufacture.ADDRESS_LINE1 ?? "",
            address_line2: manufacture.ADDRESS_LINE2 ?? "",
            postal_code: manufacture.POSTAL_CODE ?? "",
            city: manufacture.CITY ?? "",
            country: manufacture.COUNTRY ?? "",
            isChecked: is_checked,
            isUpdated: false
          }
        }
      })
    }
  })
}



const DetailTaskQA = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(detailTSInitialValue);
  const [editedItem, setEditedItem] = useState(initialManufacture);
  const [country, setCountry] = useState([]);
  const [dialog, setDialog] = useState({
    reject: false,
    approve: false
  });
  const [loadingState, setLoadingState] = useState(false);
  const [comment, setComment] = useState("");
  const [dataVersion, setDataVersion] = useState([
    { id: 1, title: "Recipe Version", value: "" },
    { id: 2, title: "Formula Version", value: "" },
    { id: 3, title: "AVL Version", value: "" },
    { id: 4, title: "MA Number And Version", value: "" },
    { id: 5, title: "Infotechna Document No.", value: "" },
  ]);
  const [rejectedActive, setRejectedActive] = useState(false);
  const [approval, setApproval] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const currentAddressRef = useRef(null);
  const [manufacturePopup, setManufacturePopup] = useState({
    isOpen: false,
    data: null
  });
  const [historyChanges, setHistoryChanges] = useState([]);

  //store
  const detailId = techServiceStore((state) => state.detailId);
  const detailType = techServiceStore((state) => state.detailType);
  const detailItemA = techServiceStore((state) => state.detailItemA);
  const token = authStore(state => state.user);

  // OpenSheet
  const { openSheet, closeSheet } = useUIStore();


  //fetch api
  const apiDetailTaskQA = useMutation(fetchDetailTaskQA);
  const apiDataContries = useMutation(fetchContries)
  const apiApprovalHistory = useMutation(fetchApprovalHistoryQA)
  const apiTaskHistory = useMutation(fetchTaskHistoryQA)
  const submitTask = useMutation(submitTaskQA);
  const funcInsertAVL = useMutation(insertAVL);
  const apiHistoryManufacture = useMutation(fetchHistoryManufacture)

  const fetchDataDetailTaskQA = useCallback(async () => {
    setLoadingState(prev => !prev)
    try {
      const resp = await apiDetailTaskQA.mutate({ param: `${detailType === EDITABLE_ENUM.Editable ? `/vendor-list/task-technical-service/${detailId}` : `/vendor-list/task-technical-service-detail/${detailId}`}` })
      const detail = resp.data[0];

      const active_ingredients = {
        id: "12222",
        title: "Active Ingredients",
        children: formatChildren(detail.ACTIVE_INGREDIENTS, setRejectedActive)
      }

      const excipients = {
        id: "222323",
        title: "Excipient Material",
        children: formatChildren(detail.EXCIPIENTS, setRejectedActive)
      }

      const packaging_material = {
        id: "3436346",
        title: "Packaging Material",
        children: formatChildren(detail.PACKAGING_MATERIALS, setRejectedActive)
      }

      const bulkMaterial = {
        id: "3436346",
        title: "Bulk Material",
        children: formatChildren(detail.BULK_MATERIALS, setRejectedActive)
      }

      const dataFormatter = [
        active_ingredients,
        excipients,
        packaging_material,
        bulkMaterial
      ]

      setDataVersion([
        { id: 1, title: "Recipe Version", value: `V.${detail.ORA_RECIPE_VERSION}` },
        { id: 2, title: "Formula Version", value: `V.${detail.ORA_FORMULA_VERSION}` },
        { id: 3, title: "AVL Version", value: `V.${detail.AVL_FORMULA_VERSION}` },
        { id: 4, title: "MA Number And Version", value: (`${detail.REGISTRATION_NUMBER} - V.${detail.NIE_VERSION}`).includes("null") ? "N/A" : (`${detail.REGISTRATION_NUMBER} - V.${detail.NIE_VERSION}`) },
        { id: 5, title: "Infotechna Document No.", value: detail.INFOTEHNA_DOCUMENT_NUMBER },
      ])

      setTitle({
        type: detail.ACTION_PLAN,
        finish_good: `${detail.ITEM_FG_NUMBER} - ${detail.ITEM_FG_DESC}`,
        item_fg_number: detail.ITEM_FG_NUMBER,
        registration_type: detail.REGISTRATION_TYPE,
        status: detail.STATUS,
        nie_version: detail.NIE_VERSION,
        nie_obj_no: detail.OBJECT_NUMBER,
        nie_eff_date: detail.NIE_EFF_DATE,
        item_fg_id: detail.ITEM_FG_ID,
        action_plan: detail.ACTION_PLAN,
        nie_no: detail.REGISTRATION_NUMBER,
        avl_version: detail.AVL_FORMULA_VERSION,
        file_url: detail.FILE_DOCUMENT_NIE
      });

      setData(dataFormatter);


      currentAddressRef.value = dataFormatter;
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingState(prev => !prev)
    }
  }, [detailId]);

  const fetchDataContries = useCallback(async () => {
    setLoadingCountry(prev => !prev)
    try {
      const resp = await apiDataContries.mutate();
      const dataLoad = resp.data;
      setCountry(dataLoad.map(item => ({ value: item.COUNTRY_NAME, label: item.COUNTRY_NAME })))
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCountry(prev => !prev)
    }
  }, [detailId]);

  const fetchApprovalHistoryData = useCallback(async () => {
    try {
      const resp = await apiApprovalHistory.mutate({ detailId })
      setApproval(resp.data)
    } catch (error) {
      console.log(error)
    }
  }, [detailId])

  const fetchTaskHistoryData = useCallback(async () => {
    try {
      const resp = await apiTaskHistory.mutate({ detailId, detailItemA })
      setDataHistory(resp.data)
    } catch (error) {
      console.log(error)
    }
  }, [detailId])


  useEffect(() => {
    fetchDataDetailTaskQA();
    fetchDataContries();
    fetchApprovalHistoryData();
    fetchTaskHistoryData();
  }, [detailId])


  const submitApproval = async () => {
    try {

      setLoadingState(prev => !prev)

      const payload = {
        detail_id: detailId,
        comment: comment,
        status: STATUS_APPROVE.COMPLETED,
        registration_type: title.registration_type,
        finish_good: title.finish_good,
        item_fg_number: title.item_fg_number,
        item_fg_id: title.item_fg_id,
        list: data
      }

      await submitTask.mutate(payload);

      if (token.USER_TYPE === USER_TYPE.QA_MANAGER) {
        await funcInsertAVL.mutate(payload);
      }

      setLoadingState(prev => !prev)
      setDialog(prev => ({ ...dialog, approve: !prev }))
      Swal.fire({
        title: "Approved",
        text: "Your approval has been submitted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        navigate("/master-data-management/approval-qa")
      })
    } catch (error) {
      console.log(error, 'ERROR')
      setLoadingState(prev => !prev)
      Swal.fire({
        title: "Failed",
        text: "Failed to approved AVL",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
      })
    } finally {
      setLoadingState(prev => !prev)
    }
  }

  const validateReject = () => {
    if (!comment) {
      Swal.fire({
        title: "Failed",
        text: "Please enter a notes",
        icon: "error",
        timer: 1500,
        showConfirmButton: false
      })
      return false;
    }
    return true;
  }

  const rejectApproval = async () => {

    if (!validateReject()) return;

    try {
      setLoadingState(prev => !prev)
      const payload = {
        detail_id: detailId,
        comment: comment,
        status: STATUS_APPROVE.REJECTED,
        registration_type: title.registration_type,
        list: data
      }
      const resp = await submitTask.mutate(payload)
      await useTimeoutAsync(() => {
        setLoadingState(prev => !prev)
        setDialog(prev => ({ ...dialog, approve: !prev }))
        Swal.fire({
          title: "Success",
          text: "Your approval has been rejected",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate("/master-data-management/approval-qa")
        })
      }, 1000);
    } catch (error) {
      setLoadingState(prev => !prev)
    }
  }

  const handleChangeDataTable = ({
    accordion_id,
    child_id,
    subchild_id,
    value
  }) => {
    setData(prevData => {
      const newData = [...prevData];

      const itemIndex = newData.findIndex(item => Number(item.id) === Number(accordion_id));
      if (itemIndex === -1) return prevData;


      const childIndex = newData[itemIndex].children.findIndex(child => Number(child.id) === Number(child_id));
      if (childIndex === -1) return prevData;


      const subchildIndex = newData[itemIndex].children[childIndex].subchild.findIndex(subchild => Number(subchild.change_value.id) === Number(subchild_id));
      if (subchildIndex === -1) return prevData;

      const updatedSubchild = [...newData[itemIndex].children[childIndex].subchild];

      updatedSubchild[subchildIndex] = {
        ...updatedSubchild[subchildIndex],
        change_value: {
          ...updatedSubchild[subchildIndex].change_value,
          ...value,
          address: `${value.address_line1}, ${value.address_line2 ?? ""}, ${value.postal_code}, ${value.city}, ${value.country}`
        }
      };

      newData[itemIndex].children[childIndex] = {
        ...newData[itemIndex].children[childIndex],
        subchild: updatedSubchild
      };


      return newData;
    })
  }


  const handleOpenSheet = (value) => {
    console.log(value, 'VALUE')
    openSheet({
      title: `Update ${value.stick_value.manufacturing_code} - ${value.stick_value.manufacturing_source}`,
      width: "lg",
      children: (
        <FormEditDrawer
          isOpen={isOpen}
          onClose={setIsOpen}
          editedItem={editedItem}
          setChangeValue={handleChangeDataTable}
          country={country}
          loadingCountry={loadingCountry}
          closeSheet={closeSheet}
        />
      ),
    });
  };


  if (loadingState) {
    return (
      <Fragment>
        <LoadingOverlay loading={loadingState} />
      </Fragment>
    )
  }

  return (
    <Fragment>
      {/* <LoadingOverlay loading={loadingState} /> */}
      <motion.div
        className="min-h-screen bg-gray-50 p-6 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="bg-white shadow-sm rounded-md">
          <motion.div
            className="border-b border-[#D2DEEB] py-4 px-4 bg-plm-grey flex items-center justify-between w-full rounded-t-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
          >
            <h1 className="text-lg font-semibold">
              Finished Product <span className="ml-4 px-4 py-2 bg-plm-rose text-white rounded-full font-600 text-lg">{title.finish_good}</span>
            </h1>
            <div>
              <h1 className="text-lg font-semibold">{title.type}</h1>
            </div>
          </motion.div>
        </header>

        <motion.main className="bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }}>
          {detailType === EDITABLE_ENUM.Editable ? (
            <TableWithAccordion
              setIsOpen={handleOpenSheet}
              regType={title.registration_type}
              versionList={dataVersion}
              urlDocument={title.file_url}
              data={data}
              setEditedItem={setEditedItem}
              setManufacturePopup={setManufacturePopup}
              setIsOpenHistory={async (e) => {
                setManufacturePopup({ ...e })
                const resp = await apiHistoryManufacture.mutate({ manufId: e.data });
                setHistoryChanges([...resp.data]);
              }}
            />
          ) : (
            <TableViewQA
              data={data}
              urlDocument={title.file_url}
              regType={title.registration_type}
              versionList={dataVersion}
              status={title.status}
              setManufacturePopup={setManufacturePopup}
              setIsOpenHistory={async (e) => {
                setManufacturePopup({ ...e })
                const resp = await apiHistoryManufacture.mutate({ manufId: e.data });
                setHistoryChanges([...resp.data]);
              }}
            />
          )}


          <div className="p-4 md:p-8">
            <TableHistory data={dataHistory} />
          </div>

          <div className="p-4 md:p-8">
            {approval.length > 0 && (
              <ApprovalInfoCard
                approval={approval}
                status={title.status}
              />
            )}
          </div>

          <TSFooterButton navigate={navigate}
            approve={() => {
              setDialog({ ...dialog, approve: true })
            }}
            reject={() => {
              setDialog({ ...dialog, reject: true })
            }}
            rejectedActive={rejectedActive}
            status={title.status}
          />

          <Dialog open={dialog.approve} onOpenChange={() => { setDialog(prev => ({ ...dialog, approve: !prev })) }}>
            <DialogContent>
              <div className="flex items-center justify-center flex-col">
                <Info size={150} className="text-[#E58200]" />
                <h1 className="text-2xl font-semibold">Approve Form ?</h1>
                <p className="text-sm text-gray-500">Please review again because this action cannot be undone.</p>
                <textarea placeholder="Enter your comment here..." className="w-full text-sm my-2 bg-slate-100 min-h-20 outline-none border border-stone-200 rounded-md p-2 resize-none" onChange={(e) => { setComment(e.target.value) }} />
                <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2 w-full border-dashed">
                  <Button variant="outline" onClick={() => { setDialog(prev => ({ ...dialog, approve: !prev })) }}>Cancel</Button>
                  <Button className="bg-gradient-to-r from-[#D32F2F] to-[#7F1710] text-white" onClick={submitApproval}>Confirm Approval</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialog.reject} onOpenChange={() => { setDialog(prev => ({ ...dialog, reject: !prev })) }}>
            <DialogContent>
              <div className="flex items-center justify-center flex-col">
                <Info size={150} className="text-[#E58200]" />
                <h1 className="text-2xl font-semibold">Reject Form ?</h1>
                <p className="text-sm text-gray-500">Please review again because this action cannot be undone.</p>
                <textarea placeholder="Enter your comment here..." className="w-full text-sm my-2 bg-slate-100 min-h-20 outline-none border border-stone-200 rounded-md p-2 resize-none" onChange={(e) => { setComment(e.target.value) }} />
                <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2 w-full border-dashed">
                  <Button variant="outline" onClick={() => { setDialog(prev => ({ ...dialog, reject: !prev })) }}>Cancel</Button>
                  <Button className="bg-gradient-to-r from-[#D32F2F] to-[#7F1710] text-white" onClick={rejectApproval}>Reject Approval</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <QAManufactureHistoryPopup
            setIsOpen={() => {
              setManufacturePopup(prev => ({ ...prev, isOpen: !prev.isOpen }))
            }}
            isOpen={manufacturePopup.isOpen}
            data={historyChanges}
            onClose={() => { setManufacturePopup(prev => ({ ...prev, isOpen: false })) }}
          />
        </motion.main>
      </motion.div>
    </Fragment>
  );
};

export default DetailTaskQA;