import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, Button, Input, Info } from "@/components/Dexain";
import FilePreview from "@/components/fields/FilePreview";
import { ImagePreview } from "@/components/common/ImagePreview";
import {
  FileText,
  Image as ImageIcon,
  ClipboardList,
  FileInput,
  History as HistoryIcon,
  MapPin,
  X,
} from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import MainCard from "@/components/common/MainCard";
import mainInstance from "@/api/instances/main.instance";
import { fetchAsFile, fetchFileBlob } from "@/api/storage";
import { useUIStore } from "@/stores/uiStore";

// Alur status usulan CPCL, dipakai untuk timeline dan tombol aksi berikutnya.
const STATUS_FLOW = [
  { value: "PENDING", label: "Diajukan" },
  { value: "VERIFIKASI_AWAL", label: "Verifikasi Awal" },
  { value: "VALIDASI_LAPANGAN", label: "Validasi Lapangan" },
  { value: "SK_DITERBITKAN", label: "SK Diterbitkan" },
  { value: "PENYALURAN_BANTUAN", label: "Penyaluran Bantuan" },
];

const NEXT_ACTION = {
  PENDING: { next: "VERIFIKASI_AWAL", label: "Setujui Verifikasi" },
  VERIFIKASI_AWAL: { next: "VALIDASI_LAPANGAN", label: "Setujui Lapangan" },
  VALIDASI_LAPANGAN: { next: "SK_DITERBITKAN", label: "Terbitkan SK" },
  SK_DITERBITKAN: { next: "PENYALURAN_BANTUAN", label: "Salurkan Bantuan" },
};

const isImagePath = (path = "") => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(path);

const UsulanCpclDetail = () => {
  const { addStack, closeStack } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const id = location?.state?.id;
  const masterData = location?.state?.masterData || {};

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);
  const [tanggapan, setTanggapan] = useState("");
  const [previewPdf, setPreviewPdf] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const loadDetail = async () => {
    if (!id) {
      setDetail(masterData);
      return;
    }
    setLoading(true);
    try {
      const res = await mainInstance.get(`/usulan-cpcl/${id}`, {
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 404,
      });

      if (res?.statusCode === 404 || res?.error === "Not Found") {
        throw new Error("Usulan tidak ditemukan");
      }

      setDetail(res);
      setTanggapan(res?.tanggapanAdmin || "");
    } catch (e) {
      // Fallback ke data yang dikirim dari halaman list agar halaman tetap terisi.
      setDetail(masterData);
      setTanggapan(masterData?.tanggapanAdmin || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const currentStatus = detail?.status || "PENDING";
  const isFinished =
    currentStatus === "PENYALURAN_BANTUAN" || currentStatus === "REJECTED";
  const nextAction = NEXT_ACTION[currentStatus];

  const activeIndex = useMemo(
    () => STATUS_FLOW.findIndex((s) => s.value === currentStatus),
    [currentStatus]
  );

  const handleUpdateStatus = (nextStatus, label) => {
    addStack({
      title: `${label}?`,
      description: "Status usulan akan diperbarui dan tercatat pada riwayat.",
      variant: nextStatus === "REJECTED" ? "danger" : "warning",
      size: "md",
      confirmText: label,
      onCancel: () => closeStack(),
      onConfirm: async () => {
        closeStack();
        setSaving(true);
        try {
          await mainInstance.patch(`/usulan-cpcl/${detail.id}/status`, {
            status: nextStatus,
            tanggapan: tanggapan || "Telah diproses oleh sistem.",
          });
          addStack({
            title: "Status Berhasil Diperbarui",
            description: `Usulan ${detail?.nomorTiket || ""} kini berstatus ${nextStatus}.`,
            variant: "success",
            isConfirm: true,
          });
          await loadDetail();
        } catch (err) {
          addStack({
            title: "Gagal Memperbarui Status",
            description:
              err?.response?.data?.message ||
              err?.message ||
              "Terjadi kesalahan pada server.",
            variant: "danger",
            isConfirm: true,
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const openProposal = async () => {
    const path = detail?.dokumenProposal;
    if (!path) {
      addStack({
        title: "Dokumen Tidak Ditemukan",
        description: "Usulan ini belum memiliki dokumen proposal di storage.",
        variant: "danger",
        isConfirm: true,
      });
      return;
    }

    try {
      if (isImagePath(path)) {
        setPreviewImage(await fetchFileBlob(path));
      } else {
        setPreviewPdf(await fetchAsFile(path, "proposal.pdf"));
      }
    } catch (e) {
      addStack({
        title: "Gagal Membuka Dokumen",
        description:
          e?.response?.data?.message ||
          e?.message ||
          "File tidak dapat diambil dari storage.",
        variant: "danger",
        isConfirm: true,
      });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Kembali
        </Button>
        {loading && (
          <span className="text-sm text-muted-foreground">Memuat data...</span>
        )}
      </div>

      <div className="mb-4">
        <MainCard
          title="Detail Usulan CPCL"
          badgeTitle={detail?.nomorTiket || "-"}
          subtitle="Status"
          badgeSubtitle={currentStatus}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Nama Kelompok" value={detail?.namaKelompok || "-"} />
            <Info label="Nama Ketua" value={detail?.namaKetua || "-"} />
            <Info label="NIK Ketua" value={detail?.nikKetua || "-"} />
            <Info label="No HP Ketua" value={detail?.noHpKetua || "-"} />
            <Info label="Kecamatan" value={detail?.kecamatan || "-"} />
            <Info label="Desa" value={detail?.desa || "-"} />
            <Info
              label="Tanggal Pengajuan"
              value={
                detail?.createdAt
                  ? new Date(detail.createdAt).toLocaleString("id-ID")
                  : "-"
              }
            />
          </div>
        </MainCard>
      </div>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-success-normal" />
            <span>Data Lokasi dan Lahan</span>
          </div>
        }
      >
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Info
            label="Titik Koordinat"
            value={detail?.titikKoordinat || "-"}
            icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
          />
          <Info
            label="Luas Lahan (Hektare)"
            value={detail?.luasLahan ?? "-"}
          />
        </div>
      </Accordion>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <FileInput className="w-4 h-4 text-success-normal" />
            <span>Usulan Alsintan & Proposal</span>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Info
              label="Jenis Alsintan Usulan"
              value={detail?.jenisAlsintanUsulan || "-"}
            />
            <Info
              label="Jumlah Usulan (Unit)"
              value={detail?.jumlahUsulanAlsintan ?? "-"}
            />
          </div>

          <div className="w-full rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isImagePath(detail?.dokumenProposal || "") ? (
                <ImageIcon className="text-success-normal" />
              ) : (
                <FileText className="text-success-normal" />
              )}
              <div>
                <div className="text-base font-medium">Dokumen Proposal</div>
                <div className="text-xs text-muted-foreground">
                  {detail?.dokumenProposal ? "Terlampir" : "Belum diunggah"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-success-normal border-success-normal hover:bg-success-normal/10"
              disabled={!detail?.dokumenProposal}
              onClick={openProposal}
            >
              Preview
            </Button>
          </div>
        </div>
      </Accordion>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-success-normal" />
            <span>Progres Verifikasi</span>
          </div>
        }
      >
        <div className="p-4 space-y-2">
          {currentStatus === "REJECTED" ? (
            <div className="rounded-md border border-danger-normal bg-danger-normal/10 px-4 py-3 text-sm text-danger-normal">
              Usulan ditolak.
            </div>
          ) : (
            STATUS_FLOW.map((step, idx) => (
              <div
                key={step.value}
                className="flex items-center gap-3 rounded-md border bg-neutral-50 px-4 py-2"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    idx <= activeIndex
                      ? "bg-success-normal text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {idx + 1}
                </span>
                <span
                  className={
                    idx <= activeIndex ? "font-medium" : "text-muted-foreground"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))
          )}
        </div>
      </Accordion>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-success-normal" />
            <span>Tanggapan Admin</span>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          {detail?.tanggapanAdmin && (
            <div className="rounded-md bg-neutral-100 p-3 text-sm">
              <strong>Tanggapan terakhir:</strong> {detail.tanggapanAdmin}
            </div>
          )}

          {isFinished ? (
            <div className="text-sm italic text-muted-foreground">
              Proses selesai. Tidak ada aksi lanjutan.
            </div>
          ) : (
            <>
              <Input
                label="Catatan / Tanggapan"
                value={tanggapan}
                onChange={(e) => setTanggapan(e.target.value)}
                placeholder="Tulis catatan verifikasi..."
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-danger-normal text-danger-normal"
                  disabled={saving}
                  onClick={() => handleUpdateStatus("REJECTED", "Tolak Usulan")}
                >
                  <X size={14} /> Tolak
                </Button>
                {nextAction && (
                  <Button
                    disabled={saving}
                    onClick={() =>
                      handleUpdateStatus(nextAction.next, nextAction.label)
                    }
                  >
                    {saving ? "Memproses..." : nextAction.label}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Accordion>

      {previewPdf && (
        <FilePreview file={previewPdf} onClose={() => setPreviewPdf(null)} />
      )}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] text-black"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-3xl w-full h-[90vh] mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-success-normal" />
                <div>
                  <h3 className="text-lg font-semibold">Image Preview</h3>
                  <p className="text-sm text-gray-600">
                    {previewImage?.type || "Image"} (
                    {((previewImage?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <ImagePreview blob={previewImage} className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsulanCpclDetail;
