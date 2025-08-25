import React, { useState } from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useNavigate } from "react-router-dom";
import { Tabs } from "@/components/fields/Tabs";
import { Table as BaseTable } from "@/components/fields/Table";
import { Button } from "@/components/Dexain";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import dayjs from "dayjs";
import NewRequestModal from "./components/NewRequestModal";
import HistoryTable from "./components/HistoryTable";

// Use a wrapped table component to enable full sorting
const Table = (props) => <BaseTable {...props} enableFullSorting={true} />;

/**
 * Main component for EPI (Existing Product Improvement) New Request page
 * Features:
 * - Tabs for My Request and My Request History
 * - Tables with filtering capabilities
 * - New Request button opening a modal form
 */
const NewRequest = () => {
  const { mutate, loading, error, response } = useMutation();
  const navigate = useNavigate();
  const openConfirmationModal = useUIStore((state) => state.openConfirmationModal);
  const [activeTab, setActiveTab] = useState("my-request");

  // Sample data for the tables
  const myRequestsData = [
    {
      id: 1,
      requestNo: "EPI-R-0001",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan pengajuan desain logo halal",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["A-1235-00 Candesartan 16mg", "A-1235-00 Candesartan 8mg"],
      existingStatus: "<p>Logo halal yang digunakan saat ini masih versi lama dan perlu diganti dengan versi terbaru dari BPOM.</p>",
      proposedChange: "<p>Mengubah logo halal menjadi versi terbaru sesuai standar BPOM dan menata ulang posisi logo pada kemasan.</p>",
      changeReason: "<p>Perubahan dibutuhkan untuk mematuhi regulasi terbaru dari BPOM mengenai persyaratan logo halal pada kemasan produk farmasi.</p>"
    },
    {
      id: 2,
      requestNo: "EPI-R-0002",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan desain kemasan primer",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["B-5678-00 Paracetamol 500mg"],
      existingStatus: "<p>Desain kemasan primer saat ini menggunakan warna yang kurang kontras dengan teks, menyebabkan informasi produk sulit terbaca.</p>",
      proposedChange: "<p>Meningkatkan kontras warna latar belakang dengan teks dan memperbesar ukuran font informasi penting.</p>",
      changeReason: "<p>Perubahan ini akan meningkatkan keterbacaan informasi produk, terutama bagi pasien lansia, dan sejalan dengan pedoman kemasan terbaru.</p>"
    },
    {
      id: 3,
      requestNo: "EPI-R-0003",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan tata letak informasi pada kemasan",
      createdDate: "2023-01-10",
      status: "Need For Revision",
      products: ["C-9101-00 Amoxicillin 500mg"],
      existingStatus: "<p>Informasi dosis dan peringatan efek samping terletak di bagian belakang kemasan dan kurang menonjol.</p>",
      proposedChange: "<p>Pindahkan informasi dosis dan peringatan ke bagian depan kemasan dengan kotak peringatan berwarna merah.</p>",
      changeReason: "<p>Meningkatkan keselamatan pasien dengan memastikan informasi penting lebih mudah dilihat dan dibaca.</p>"
    },
    {
      id: 4,
      requestNo: "EPI-R-0004",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Penambahan QR code pada kemasan",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["A-1235-00 Candesartan 16mg"],
      existingStatus: "<p>Kemasan saat ini tidak memiliki QR code untuk akses informasi produk digital.</p>",
      proposedChange: "<p>Tambahkan QR code di sudut kanan bawah kemasan yang mengarah ke situs web informasi produk lengkap.</p>",
      changeReason: "<p>Memberikan akses cepat bagi konsumen ke informasi produk yang lebih rinci, instruksi penggunaan, dan FAQ.</p>"
    },
    {
      id: 5,
      requestNo: "EPI-R-0005",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan bahan kemasan sekunder",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["B-5678-00 Paracetamol 500mg", "C-9101-00 Amoxicillin 500mg"],
      existingStatus: "<p>Kemasan sekunder menggunakan karton standar yang rentan terhadap kelembaban.</p>",
      proposedChange: "<p>Ganti dengan karton berlapis film pelindung yang lebih tahan kelembaban dan memiliki segel anti-tamper.</p>",
      changeReason: "<p>Meningkatkan perlindungan produk dari kelembaban dan memberikan keamanan tambahan untuk mencegah pemalsuan.</p>"
    }
  ];

  const myRequestHistoryData = [
    {
      id: 1,
      requestNo: "EPI-R-0001",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan pengajuan desain logo halal",
      submittedDate: "2023-12-21T16:57:00",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["A-1235-00 Candesartan 16mg", "A-1235-00 Candesartan 8mg"],
      existingStatus: "<p>Logo halal yang digunakan saat ini masih versi lama dan perlu diganti dengan versi terbaru dari BPOM.</p>",
      proposedChange: "<p>Mengubah logo halal menjadi versi terbaru sesuai standar BPOM dan menata ulang posisi logo pada kemasan.</p>",
      changeReason: "<p>Perubahan dibutuhkan untuk mematuhi regulasi terbaru dari BPOM mengenai persyaratan logo halal pada kemasan produk farmasi.</p>"
    },
    {
      id: 2,
      requestNo: "EPI-R-0003",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Perubahan tata letak informasi pada kemasan",
      submittedDate: "2023-12-21T16:57:00",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["C-9101-00 Amoxicillin 500mg"],
      existingStatus: "<p>Informasi dosis dan peringatan efek samping terletak di bagian belakang kemasan dan kurang menonjol.</p>",
      proposedChange: "<p>Pindahkan informasi dosis dan peringatan ke bagian depan kemasan dengan kotak peringatan berwarna merah.</p>",
      changeReason: "<p>Meningkatkan keselamatan pasien dengan memastikan informasi penting lebih mudah dilihat dan dibaca.</p>"
    },
    {
      id: 3,
      requestNo: "EPI-R-0004",
      category: "Packaging Material",
      subCategory: "Packaging Design",
      title: "Penambahan QR code pada kemasan",
      submittedDate: "2023-12-21T16:57:00",
      createdDate: "2023-01-10",
      status: "Draft",
      products: ["A-1235-00 Candesartan 16mg"],
      existingStatus: "<p>Kemasan saat ini tidak memiliki QR code untuk akses informasi produk digital.</p>",
      proposedChange: "<p>Tambahkan QR code di sudut kanan bawah kemasan yang mengarah ke situs web informasi produk lengkap.</p>",
      changeReason: "<p>Memberikan akses cepat bagi konsumen ke informasi produk yang lebih rinci, instruksi penggunaan, dan FAQ.</p>"
    }
  ];

  // Column definitions for My Request table
  const myRequestColumns = [
    {
      accessorKey: "requestNo",
      header: "EPI Request No",
      enableSorting: true,
      meta: { enableSorting: true },
    },
    {
      accessorKey: "category",
      header: "EPI Category",
      enableSorting: true,
      meta: { enableSorting: true },
    },
    {
      accessorKey: "subCategory",
      header: "EPI Sub Category",
      enableSorting: true,
      meta: { enableSorting: true },
    },
    {
      accessorKey: "title",
      header: "EPI Request Title",
      enableSorting: true,
      meta: { enableSorting: true },
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ row }) => dayjs(row.original.createdDate).format("DD MMMM YYYY"),
      enableSorting: true,
      meta: { enableSorting: true },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      meta: { enableSorting: true },
      cell: ({ row }) => {
        const status = row.original.status;
        let textColorClass = "font-medium";

        if (status === "Draft") {
          textColorClass += " text-gray-600";
        } else if (status === "Need For Revision") {
          textColorClass += " text-yellow-600";
        } else if (status === "Approved") {
          textColorClass += " text-green-600";
        } else if (status === "Terminated") {
          textColorClass += " text-primary-normal-600";
        } else if (status === "Waiting For Approval") {
          textColorClass += " text-blue-600";
        }

        return <span className={textColorClass}>{status}</span>;
      }
    }
  ];

  // Filter column definitions
  const myRequestFilterColumns = [
    { id: "requestNo", type: "text" },
    { id: "category", type: "checkbox", options: ["Packaging Material", "Raw Material", "Manufacturing Process"] },
    { id: "subCategory", type: "checkbox", options: ["Packaging Design", "Packaging Composition", "Material Change", "Material Quality", "Process Improvement", "Process Change"] },
    { id: "title", type: "text" },
    { id: "createdDate", type: "date" },
    { id: "status", type: "checkbox", options: ["Draft", "Waiting For Approval", "Need For Revision", "Approved", "Terminated"] },
  ];

  // History table filter column definitions
  const myRequestHistoryFilterColumns = [
    { id: "requestNo", type: "text" },
    { id: "category", type: "checkbox", options: ["Packaging Material", "Raw Material", "Manufacturing Process"] },
    { id: "subCategory", type: "checkbox", options: ["Packaging Design", "Packaging Composition", "Material Change", "Material Quality", "Process Improvement", "Process Change"] },
    { id: "title", type: "text" },
    { id: "submittedDate", type: "datetime" },
    { id: "createdDate", type: "date" },
    { id: "status", type: "checkbox", options: ["Draft", "Waiting For Approval", "Need For Revision", "Approved", "Terminated"] },
  ];

  // Handle viewing a request
  const handleViewRequest = (request) => {
    // Store complete request data in localStorage
    localStorage.setItem('selectedRequestData', JSON.stringify(request));

    // Navigate to the proposal detail page with the request ID
    navigate(`/epi/new-request/detail?requestId=${request.requestNo}`);
  };

  // Handle opening the new request modal
  const handleCreateRequest = () => {
    openConfirmationModal({
      content: <NewRequestModal />,
      hideButtons: true
    });
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const actions = [
    {
      label: "View",
      onClick: handleViewRequest
    }
  ];

  return (
    <div className="-mt-[9px] -ml-[15px] -mr-[12px]">
      {/* Sticky Tabs di bawah header - using negative margins like ProjectManagement */}
      <div className="sticky top-0 z-10 ">
        <Tabs 
          sticky="top"
          variant="sticky"
          tabs={[
            { label: "My Request", value: "my-request" },
            { label: "My Request History", value: "my-request-history" },
            {
              label: (
                <div className="flex items-center justify-end w-max pr-2">
                  <span 
                    className="text-white bg-gradient-to-r from-[#D32F2F] to-[#7F1710] hover:opacity-90 flex items-center gap-1 text-xs px-2 py-0.5 h-6 rounded cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCreateRequest();
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    New Request
                  </span>
                </div>
              ),
              value: "new-request-button",
              disabled: true,
              noIndicator: true,
              customWidth: "130px"
            }
          ]}
          value={activeTab}
          onValueChange={handleTabChange}
        />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 mt-3 px-3 overflow-auto">
        <div className="h-full">
          {activeTab === "my-request" ? (
            <div className="border rounded-md overflow-hidden relative" style={{ zIndex: 'auto' }}>
              <Table
                columns={myRequestColumns}
                data={myRequestsData}
                filterableColumns={myRequestFilterColumns}
                searchable={false}
                pagination={true}
                pageSize={10}
                actions={actions}
                actionType="button"
                actionHeader="View"
                actionVariant="icon"
              />
            </div>
          ) : (
            <div className="overflow-hidden relative" style={{ zIndex: 'auto' }}>
              <HistoryTable 
                data={myRequestHistoryData} 
                filterableColumns={myRequestHistoryFilterColumns}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequest;