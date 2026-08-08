import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, Button, Input, Info } from "@/components/Dexain";
import FilePreview from "@/components/fields/FilePreview";
import { ImagePreview } from "@/components/common/ImagePreview";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  FileInput,
  SendHorizontal,
} from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import MainCard from "@/components/common/MainCard";
import mainInstance from "@/api/instances/main.instance";
import { fetchAsFile, fetchFileBlob } from "@/api/storage";
import { useUIStore } from "@/stores/uiStore";

const isImagePath = (path = "") => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(path);

const PengaduanDetail = () => {
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
      setTanggapan(masterData?.tanggapanPetugas || "");
      return;
    }
    setLoading(true);
    try {
      const res = await mainInstance.get(`/pengaduan/${id}`, {
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 404,
      });

      if (res?.statusCode === 404 || res?.error === "Not Found") {
        throw new Error("Pengaduan tidak ditemukan");
      }

      setDetail(res);
      setTanggapan(res?.tanggapanPetugas || "");
    } catch (e) {
      // Fallback ke data dari halaman list agar halaman tetap terisi.
      setDetail(masterData);
      setTanggapan(masterData?.tanggapanPetugas || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const sudahDibalas = !!detail?.tanggapanPetugas;

  const handleBalas = () => {
    if (!tanggapan?.trim()) {
      addStack({
        title: "Tanggapan Masih Kosong",
        description: "Isi tanggapan terlebih dahulu sebelum mengirim.",
        variant: "warning",
        isConfirm: true,
      });
      return;
    }

    addStack({
      title: "Kirim Tanggapan?",
      description: "Tanggapan akan tampil pada pelapor dan tidak dapat dihapus.",
      variant: "warning",
      size: "md",
      confirmText: (
        <div className="flex items-center gap-2">
          Kirim <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        closeStack();
        setSaving(true);
        try {
          await mainInstance.patch(`/pengaduan/${detail.id}/tanggapan`, {
            tanggapan_petugas: tanggapan,
          });
          addStack({
            title: "Tanggapan Terkirim",
            description: `Pengaduan ${detail?.nomorTiket || ""} sudah ditanggapi.`,
            variant: "success",
            isConfirm: true,
          });
          await loadDetail();
        } catch (err) {
          addStack({
            title: "Gagal Mengirim Tanggapan",
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

  const openLampiran = async () => {
    const path = detail?.buktiLampiran;
    if (!path) {
      addStack({
        title: "Lampiran Tidak Ditemukan",
        description: "Pengaduan ini tidak memiliki bukti lampiran di storage.",
        variant: "danger",
        isConfirm: true,
      });
      return;
    }

    try {
      if (isImagePath(path)) {
        setPreviewImage(await fetchFileBlob(path));
      } else {
        setPreviewPdf(await fetchAsFile(path, "lampiran.pdf"));
      }
    } catch (e) {
      addStack({
        title: "Gagal Membuka Lampiran",
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
          title="Detail Pengaduan"
          badgeTitle={detail?.nomorTiket || "-"}
          subtitle="Status"
          badgeSubtitle={sudahDibalas ? "Sudah Ditanggapi" : "Menunggu Tanggapan"}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Nama Pelapor" value={detail?.namaPelapor || "-"} />
            <Info label="Kontak Pelapor" value={detail?.kontakPelapor || "-"} />
            <Info label="Kategori" value={detail?.kategoriPengaduan || "-"} />
            <Info
              label="Tanggal Lapor"
              value={
                detail?.createdAt
                  ? new Date(detail.createdAt).toLocaleString("id-ID")
                  : "-"
              }
            />
            <Info
              label="Terakhir Diperbarui"
              value={
                detail?.updatedAt
                  ? new Date(detail.updatedAt).toLocaleString("id-ID")
                  : "-"
              }
            />
          </div>
        </MainCard>
      </div>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-success-normal" />
            <span>Isi Pengaduan</span>
          </div>
        }
      >
        <div className="p-4">
          <Info
            label="Deskripsi"
            value={detail?.deskripsi || "-"}
            containerClassName="col-span-full"
          />
        </div>
      </Accordion>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <FileInput className="w-4 h-4 text-success-normal" />
            <span>Bukti Lampiran</span>
          </div>
        }
      >
        <div className="p-4">
          <div className="w-full rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isImagePath(detail?.buktiLampiran || "") ? (
                <ImageIcon className="text-success-normal" />
              ) : (
                <FileText className="text-success-normal" />
              )}
              <div>
                <div className="text-base font-medium">Bukti Lampiran</div>
                <div className="text-xs text-muted-foreground">
                  {detail?.buktiLampiran ? "Terlampir" : "Tidak ada lampiran"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-success-normal border-success-normal hover:bg-success-normal/10"
              disabled={!detail?.buktiLampiran}
              onClick={openLampiran}
            >
              Preview
            </Button>
          </div>
        </div>
      </Accordion>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-success-normal" />
            <span>Tanggapan Petugas</span>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          {sudahDibalas ? (
            <>
              <div className="rounded-md bg-neutral-100 p-3 text-sm">
                <strong>Balasan:</strong> {detail.tanggapanPetugas}
              </div>
              <Input
                label="Perbarui Tanggapan"
                value={tanggapan}
                onChange={(e) => setTanggapan(e.target.value)}
                placeholder="Tulis tanggapan baru..."
              />
              <div className="flex justify-end">
                <Button disabled={saving} onClick={handleBalas}>
                  {saving ? "Mengirim..." : "Perbarui Tanggapan"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                label="Tanggapan"
                value={tanggapan}
                onChange={(e) => setTanggapan(e.target.value)}
                placeholder="Balas pengaduan..."
              />
              <div className="flex justify-end">
                <Button disabled={saving} onClick={handleBalas}>
                  {saving ? "Mengirim..." : "Kirim Balasan"}
                </Button>
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

export default PengaduanDetail;
