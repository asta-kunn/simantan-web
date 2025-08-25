import { apiGetDetailSubstitutionItem, apiSubmitApproval } from "@/services/master-data-management/item-substitusi.service";
import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDateMonth } from "@/lib/utils";
import { Button, Card, TextArea } from "@/components/Dexain";
import techServiceStore from "@/stores/techServiceStore";
import { useUIStore } from "@/stores/uiStore";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import DetailApprovalSkeleton from "./components/detail-approval-skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import NotificationSuccess from "../../EditTaskItem/components/notification-success";
import FooterApprovalTaskItem from "./components/footer-approval-item";
import authStore from "@/stores/authStore";
import useFetchApprovalHistory from "../hooks/useFetchApprovalHistory";
import ApprovalHistoryItemSubstitution from "./components/approval-history-item-substitution";


// Komponen untuk menampilkan informasi produk
const ProductInfoSection = ({ data }) => (
  <div className="w-full">
    <p className="text-stone-400 text-md my-2">Finished Product</p>
    <p className="text-black text-base">
      {data.PRODUCT_NAME} - {data.PRODUCT_DESCRIPTION}
    </p>
  </div>
);

// Komponen untuk menampilkan formula dan version
const FormulaVersionSection = ({ data }) => (
  <div className="flex flex-row gap-2 my-4">
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Formula</p>
      <p className="text-black text-base">{data.FORMULA}</p>
    </div>
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Version</p>
      <p className="text-black text-base">{data.VERSION}</p>
    </div>
  </div>
);

// Komponen untuk menampilkan requestor dan tanggal request
const RequestorSection = ({ data }) => (
  <div className="flex flex-row gap-2 my-4 items-start justify-start">
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Requestor</p>
      <p className="text-black text-base">{data.REQUESTOR}</p>
      <p className="text-black text-base text-rose-600">{data.CREATED_BY}</p>
    </div>
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Request Date</p>
      <p className="text-black text-base">{formatDateMonth(data.CREATED_DATE)}</p>
    </div>
  </div>
);

// Komponen untuk header detail
const DetailHeader = ({ requestId = "IS-R-0001", status = "Waiting for Approval SCM Manager", handleOpenSheet }) => (
  <div className="border-b border-[#D2DEEB] p-4 bg-plm-grey flex items-center justify-between w-full rounded-t-md">
    <div className="flex items-center justify-start">
      <p className="text-md">
        Request ID{" "}
        <span className="bg-white text-black rounded-xl px-2 py-1 font-semibold">
          {requestId}
        </span>
      </p>
    </div>
    <div className="flex items-center justify-start flex-row gap-2">
      <p className="text-md">
        Status{" "}
        <span className=" text-md text-white bg-[#d35400] rounded-2xl px-3 py-1 font-light">
          {status}
        </span>
      </p>
      <HistoryIcon className="text-[#d35400] hover:text-[#e67e22] transition-all duration-100 hover:cursor-pointer" onClick={handleOpenSheet} />
    </div>
  </div>
);

const SerializationSection = ({ data }) => (
  <div className="flex flex-row gap-2 items-start justify-start">
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Serialization Implementation Status</p>
      <p className="text-black text-base">{data.IMPLEMENTATION_STATUS}</p>
    </div>
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Serialization Due Date</p>
      <p className="text-black text-base">{formatDateMonth(data.SERIALIZATION_DUE_DATE)}</p>
    </div>
    <div className="w-1/3">
      <p className="text-stone-400 text-md my-2">Changes affecting MI?</p>
      <p className="text-black text-base">{data.MI_CHANGED === 'Y' ? "Yes" : "No"}</p>
    </div>
  </div>
);

const ItemReplacementSegment = ({ data }) => (
  <Card
    key={"SECONDARY_KEY"}
    title="Item Replacement Details"
  >
    <div className="flex flex-row gap-2 bg-slate-100 rounded-md p-4">
      <div className="w-5/12 flex-col">
        <div className="flex flex-row w-full">
          <div className="w-1/2">
            <p className="text-md font-semibold text-center">Original Item</p>
          </div>
          <div className="w-1/4">
            <p className="text-md font-semibold text-center">Quantity</p>
          </div>
          <div className="w-1/4">
            <p className="text-md font-semibold text-center">UOM</p>
          </div>
        </div>
        <div className="mt-2">
          {data.ITEM_REPLACEMENT.map((item) => (
            <div key={item.ITEM_REPLACEMENT_ID} className="bg-white">
              <div className="flex flex-row  w-full">
                <div className="w-1/2 flex items-center justify-center p-2 border">
                  <p className="text-md">{item.ORIGINAL_ITEM_NUMBER} - {item.ORIGINAL_ITEM_DESCRIPTION}</p>
                </div>
                <div className="w-1/4 flex items-center justify-center border">
                  <p className="text-md">{item.ORIGINAL_ITEM_QUANTITY}</p>
                </div>
                <div className="w-1/4 flex items-center justify-center bg-sky-100 border">
                  <p className="text-md">{item.ORIGINAL_ITEM_UOM}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/6 flex items-center justify-center">
        <ArrowRightIcon className="text-blue-700" />
      </div>
      <div className="w-5/12">
        <div className="flex flex-row w-full">
          <div className="w-1/2">
            <p className="text-md font-semibold text-center">Replacement Item</p>
          </div>
          <div className="w-1/4">
            <p className="text-md font-semibold text-center">Quantity</p>
          </div>
          <div className="w-1/4">
            <p className="text-md font-semibold text-center">UOM</p>
          </div>
        </div>
        <div className="mt-2">
          {data.ITEM_REPLACEMENT.map((item) => (
            <div key={item.ITEM_REPLACEMENT_ID} className="bg-white">
              <div className="flex flex-row w-full">
                <div className="w-1/2 flex items-center justify-center p-2 border">
                  <p className="text-md">{item.REPLACEMENT_ITEM_NUMBER} - {item.REPLACEMENT_ITEM_DESCRIPTION}</p>
                </div>
                <div className="w-1/4 flex items-center justify-center border">
                  <p className="text-md">{item.REPLACEMENT_ITEM_QUANTITY}</p>
                </div>
                <div className="w-1/4 flex items-center justify-center bg-sky-100 border">
                  <p className="text-md">{item.REPLACEMENT_ITEM_UOM}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-row gap-2 my-6 items-start justify-start">
      <div className="w-1/3">
        <p className="text-stone-400 text-md my-2">Valid From</p>
        <p className="text-black text-base">{formatDateMonth(data.VALID_FROM)}</p>
      </div>
      <div className="w-1/3">
        <p className="text-stone-400 text-md my-2">Valid To</p>
        <p className="text-black text-base">{formatDateMonth(data.VALID_TO)}</p>
      </div>
    </div>

    <div className="flex flex-row gap-2 my-6 items-start justify-start">
      <div className="w-1/3">
        <p className="text-stone-400 text-md my-2">Notes</p>
        <p className="text-black text-base">{data.SUBMISSION_NOTES || '-'}</p>
      </div>
    </div>
  </Card>
);

// Komponen untuk konten modal, agar state message tetap sinkron
const ModalMessageContent = ({ changeValue }) => {
  const [message, setMessage] = useState("");
  return (
    <div>
      <TextArea
        value={message}
        onChange={(e) => {
          changeValue(e.target.value)
          setMessage(e.target.value)
        }}
        placeholder="Enter your message here"
      />
    </div>
  )
}

const DetailApprovalTaskItem = () => {
  const detailSubstitutionItem = techServiceStore(state => state.detailSubstitutionItem);
  const user = authStore(state => state.user);
  const openConfirmationModal = useUIStore(state => state.openConfirmationModal);
  const closeConfirmationModal = useUIStore(state => state.closeConfirmationModal);
  const { openSheet } = useUIStore();
  const message = useRef('');
  const navigate = useNavigate();


  //consume api
  const { data: dataDetailSubstitutionItem } = useQuery({
    queryKey: ["detail-substitution-item"],
    queryFn: () => apiGetDetailSubstitutionItem(detailSubstitutionItem),
  });
  const { dataApproval } = useFetchApprovalHistory({ requestId: detailSubstitutionItem });


  //mutate api
  const { mutate: submitApproval, isPending: loadingSubmit } = useMutation({
    mutationFn: apiSubmitApproval,
    onSuccess: (result) => {
      if (result.success) {
        closeConfirmationModal();
        toast(<NotificationSuccess title="Approval Success" description="The request has been approved successfully." />, {
          duration: 2000,
          action: {
            label: "Reload",
            onClick: () => window.location.reload(),
          },
        });
        setTimeout(() => {
          navigate("/master-data-management/list-approval-item-substitution")
        }, 2000)
      }
    }
  });

  const handleSubmitApproval = useCallback(async () => {
    await submitApproval({
      requestId: detailSubstitutionItem,
      message: message.current,
    });
  }, [submitApproval, detailSubstitutionItem, message])

  const handleApprove = useCallback(() => {
    openConfirmationModal({
      title: "Submit Request",
      variant: "default",
      description: "Are you sure you want to submit this request?",
      content: (
        <ModalMessageContent
          changeValue={(value) => {
            message.current = value;
          }}
        />
      ),
      footer: (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => closeConfirmationModal()}>Cancel</Button>
          <Button loading={loadingSubmit} onClick={handleSubmitApproval}>Confirm</Button>
        </div>
      )
    });
  }, [openConfirmationModal, closeConfirmationModal])

  const handleOpenSheet = () => {
    openSheet({
      title: "Approval History",
      description: "View detailed approval history for this item.",
      width: "md",
      children: (
        <ApprovalHistoryItemSubstitution dataApproval={dataApproval} />
      )
    })
  }

  if (!dataDetailSubstitutionItem) return <DetailApprovalSkeleton />;

  const data = dataDetailSubstitutionItem.data;

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white shadow-sm rounded-md">
        <DetailHeader
          requestId={data.REQUEST_ID || "IS-R-0001"}
          status={data.STATUS || "Waiting for Approval SCM Manager"}
          handleOpenSheet={handleOpenSheet}
        />
        <div className="bg-white border-l border-b border-r p-4 rounded-b-md">
          <ProductInfoSection data={data} />
          <FormulaVersionSection data={data} />
          <div className="w-full border-t border-[#D2DEEB] my-4" />
          <RequestorSection data={data} />
        </div>
      </div>

      {/* Jika ingin menampilkan section lain, bisa gunakan komponen yang sama */}
      <motion.div
        className="bg-white border p-4 rounded-md my-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SerializationSection data={data} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <ItemReplacementSegment data={data} />
      </motion.div>

      <FooterApprovalTaskItem
        handleApprove={handleApprove}
        navigate={navigate}
        user={user}
        status={data.STATUS}
      />
    </motion.div>
  );
};

export default DetailApprovalTaskItem;
