import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, Button, Input, Info, Uploader, Select } from "@/components/Dexain";
import FilePreview from "@/components/fields/FilePreview";
import { ImagePreview } from "@/components/common/ImagePreview";
import { FileText, Image as ImageIcon, History as HistoryIcon, SendHorizontal, ClipboardList, FileInput } from "lucide-react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import MainCard from "@/components/common/MainCard";
import mainInstance from "@/api/instances/main.instance";
import { useUIStore } from "@/stores/uiStore";

const AlsintanDetail = () => {
  const { addStack, closeStack, clearStacks } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const type = location?.state?.type || "APBN";

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [savingPemanfaatan, setSavingPemanfaatan] = useState(false);
  const [uploadingLaporan, setUploadingLaporan] = useState(false);
  const [isEditingPemanfaatan, setIsEditingPemanfaatan] = useState(false);
  const [isEditingLaporan, setIsEditingLaporan] = useState(false);
  const [pemanfaatanForm, setPemanfaatanForm] = useState({
    tanggalAwalPenggunaan: "",
    tanggalAkhirPenggunaan: "",
    totalAreaDikerjakan: "",
    kondisiAlsintan: "",
    jenisAlsintan: "",
    merekAlsintan: "",
    perawatanDilakukan: "",
    pengguna: "",
    lokasi: ""
  });
  const [laporanForm, setLaporanForm] = useState({
    documentUrlKondisi: "",
    documentUrlPemanfaatan: ""
  });
  const [kondisiFile, setKondisiFile] = useState(null);
  const [pemanfaatanFile, setPemanfaatanFile] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showKondisiExisting, setShowKondisiExisting] = useState(false);
  const [showPemanfaatanExisting, setShowPemanfaatanExisting] = useState(false);

  const kondisiOptions = [
    { label: "Operasional", value: "Operasional" },
    { label: "Tidak Operasional", value: "Tidak Operasional" }
  ];

  const isPemanfaatanFilled = useMemo(() => {
    if (!detail) return false;
    return (
      !!detail.tanggalAwalPenggunaan ||
      !!detail.tanggalAkhirPenggunaan ||
      !!detail.totalAreaDikerjakan ||
      !!detail.kondisiAlsintan ||
      !!detail.jenisAlsintan ||
      !!detail.merekAlsintan ||
      !!detail.perawatanDilakukan ||
      !!detail.pengguna ||
      !!detail.lokasi
    );
  }, [detail]);

  const isLaporanFilled = useMemo(() => {
    if (!detail) return false;
    return Array.isArray(detail?.documents) && detail.documents.length > 0;
  }, [detail]);

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await mainInstance.get(`/reports/${id}`);
      setDetail(res);
      setPemanfaatanForm({
        tanggalAwalPenggunaan: res?.tanggalAwalPenggunaan || "",
        tanggalAkhirPenggunaan: res?.tanggalAkhirPenggunaan || "",
        totalAreaDikerjakan: res?.totalAreaDikerjakan || "",
        kondisiAlsintan: res?.kondisiAlsintan || "",
        jenisAlsintan: res?.jenisAlsintan || "",
        merekAlsintan: res?.merekAlsintan || "",
        perawatanDilakukan: res?.perawatanDilakukan || "",
        pengguna: res?.pengguna || "",
        lokasi: res?.lokasi || ""
      });
      setLaporanForm({
        documentUrlKondisi: res?.documentUrlKondisi || "",
        documentUrlPemanfaatan: res?.documentUrlPemanfaatan || ""
      });
      setIsEditingPemanfaatan(!(res?.tanggalAwalPenggunaan));
      const hasAnyDoc = Array.isArray(res?.documents) && res.documents.length > 0;
      setIsEditingLaporan(!hasAnyDoc);
    } catch (e) {
      // Fallback demo: if detail id tidak ditemukan, pakai id 2
      try {
        const fallback = await mainInstance.get(`/reports/2`);
        setDetail(fallback);
        setPemanfaatanForm({
          tanggalAwalPenggunaan: fallback?.tanggalAwalPenggunaan || "",
          tanggalAkhirPenggunaan: fallback?.tanggalAkhirPenggunaan || "",
          totalAreaDikerjakan: fallback?.totalAreaDikerjakan || "",
          kondisiAlsintan: fallback?.kondisiAlsintan || "",
          jenisAlsintan: fallback?.jenisAlsintan || "",
          merekAlsintan: fallback?.merekAlsintan || "",
          perawatanDilakukan: fallback?.perawatanDilakukan || "",
          pengguna: fallback?.pengguna || "",
          lokasi: fallback?.lokasi || ""
        });
        setLaporanForm({
          documentUrlKondisi: fallback?.documentUrlKondisi || "",
          documentUrlPemanfaatan: fallback?.documentUrlPemanfaatan || ""
        });
        setIsEditingPemanfaatan(!(fallback?.tanggalAwalPenggunaan));
      } catch (e2) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSavePemanfaatan = async () => {
    setSavingPemanfaatan(true);
    try {
      const payload = {
        tanggalAwalPenggunaan: pemanfaatanForm.tanggalAwalPenggunaan,
        tanggalAkhirPenggunaan: pemanfaatanForm.tanggalAkhirPenggunaan,
        totalAreaDikerjakan: Number(pemanfaatanForm.totalAreaDikerjakan),
        kondisiAlsintan: pemanfaatanForm.kondisiAlsintan,
        jenisAlsintan: pemanfaatanForm.jenisAlsintan,
        merekAlsintan: pemanfaatanForm.merekAlsintan,
        perawatanDilakukan: pemanfaatanForm.perawatanDilakukan,
        pengguna: pemanfaatanForm.pengguna,
        lokasi: pemanfaatanForm.lokasi
      };
      const reportId = detail?.id ?? id;
      addStack({
        title: "Simpan Form Pemanfaatan?",
        description: "Pastikan data sudah benar, tindakan ini tidak dapat dibatalkan.",
        variant: "warning",
        size: "md",
        confirmText: (
          <div className="flex items-center gap-2">Confirm <SendHorizontal className="size-4" /></div>
        ),
        onCancel: () => closeStack(),
        onConfirm: async () => {
          closeStack();
          try {
            await mainInstance.patch(`/reports/${reportId}/form`, payload, { params: { type } });
            await loadDetail();
            setIsEditingPemanfaatan(false);
            addStack({
              title: "Berhasil Menyimpan Form",
              description: "Form Pemanfaatan sudah disimpan.",
              variant: "success",
              isConfirm: true,
            });
          } catch (err) {
            // noop - fallback handled by backend
            clearStacks();
          }
        },
      });
    } catch (e) {
    } finally {
      setSavingPemanfaatan(false);
    }
  };

  const handleUploadLaporan = async () => {
    if (!kondisiFile && !pemanfaatanFile) return;
    setUploadingLaporan(true);
    try {
      // Dummy schema: fixed JSON payload
      const payload = {
        documentUrlKondisi: "https://contoh1.com/dokumen/laporan_kondisi.pdf",
        documentUrlPemanfaatan: "https://contoh1.com/dokumen/laporan_kondisi.pdf",
      };
      const reportId2 = detail?.id ?? id;
      addStack({
        title: "Kirim Laporan?",
        description: "Pastikan file yang Anda unggah sudah benar.",
        variant: "warning",
        size: "md",
        confirmText: (
          <div className="flex items-center gap-2">Confirm <SendHorizontal className="size-4" /></div>
        ),
        onCancel: () => closeStack(),
        onConfirm: async () => {
          closeStack();
          try {
            await mainInstance.patch(`/reports/${reportId2}/laporan`, payload, { params: { type }, headers: { "Content-Type": "application/json" } });
            await loadDetail();
            setKondisiFile(null);
            setPemanfaatanFile(null);
            setIsEditingLaporan(false);
            addStack({
              title: "Laporan Berhasil Dikirim",
              description: "File laporan kondisi/pemanfaatan telah tersimpan.",
              variant: "success",
              isConfirm: true,
            });
          } catch (err) {
            // UI fallback handled below
            clearStacks()
          }
        },
      });
    } catch (e) {
      // Demo fallback: update UI as if success
      const now = new Date().toISOString();
      const newDocs = [
        kondisiFile ? { document_id: Date.now(), documentUrl: "/kondisi_dummy.png", version: now, isCurrent: true, type: "KONDISI" } : null,
        pemanfaatanFile ? { document_id: Date.now() + 1, documentUrl: "/pemanfaatan_dummy.pdf", version: now, isCurrent: true, type: "PEMANFAATAN" } : null,
      ].filter(Boolean);
      setDetail((prev) => ({
        ...prev,
        documents: Array.isArray(prev?.documents)
          ? [
              ...newDocs,
              ...prev.documents.map((d) => ({ ...d, isCurrent: false })),
            ]
          : newDocs,
      }));
      setKondisiFile(null);
      setPemanfaatanFile(null);
      setIsEditingLaporan(false);
    } finally {
      setUploadingLaporan(false);
    }
  };

  const currentKondisi = useMemo(
    () => detail?.documents?.find((d) => d.type === "KONDISI" && d.isCurrent),
    [detail]
  );
  const currentPemanfaatan = useMemo(
    () => detail?.documents?.find((d) => d.type === "PEMANFAATAN" && d.isCurrent),
    [detail]
  );
  useEffect(() => {
    if (isEditingLaporan) {
      setShowKondisiExisting(!!currentKondisi);
      setShowPemanfaatanExisting(!!currentPemanfaatan);
    }
  }, [isEditingLaporan, currentKondisi, currentPemanfaatan]);

  const openDocPreview = async (doc) => {
    // Always preview local dummy file (no real API fetch)
    const isKondisi = doc?.type === "KONDISI";
    const path = isKondisi ? "/kondisi_dummy.png" : "/pemanfaatan_dummy.pdf";
    try {
      const res = await fetch(path);
      const blob = await res.blob();
      if (isKondisi) {
        setPreviewImage(blob);
      } else {
        const file = new File([blob], `preview.pdf`, { type: 'application/pdf' });
        setPreviewPdf(file);
      }
    } catch (e) {}
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <MainCard
          title="Laporan Alsintan"
          badgeTitle={detail?.namaPoktan || "-"}
          subtitle="Jenis"
          badgeSubtitle={detail?.type || type}
        >
          <div className="grid grid-cols-3 gap-4">
            <Info label="Kel/Desa" value={detail?.kelurahanDesa || "-"} />
            <Info label="ID Poktan" value={detail?.idPoktan || "-"} />
            <Info label="Ketua Poktan" value={detail?.ketuaPoktan || "-"} />
            <Info label="Alamat" value={detail?.alamatSekretariat || "-"} containerClassName="col-span-full" />
          </div>
        </MainCard>
      </div>

      <Accordion title={(
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-success-normal" />
          <span>Input Form</span>
        </div>
      )}>
        <div className="p-4 space-y-3">
          {!isEditingPemanfaatan && isPemanfaatanFilled ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Info label="Tanggal Awal" value={detail?.tanggalAwalPenggunaan || "-"} />
                <Info label="Tanggal Akhir" value={detail?.tanggalAkhirPenggunaan || "-"} />
                <Info label="Total Area (ha)" value={detail?.totalAreaDikerjakan || "-"} />
                <Info label="Kondisi Alsintan" value={detail?.kondisiAlsintan || "-"} />
                <Info label="Jenis Alsintan" value={detail?.jenisAlsintan || "-"} />
                <Info label="Merek Alsintan" value={detail?.merekAlsintan || "-"} />
                <Info label="Pengguna" value={detail?.pengguna || "-"} />
                <Info label="Lokasi" value={detail?.lokasi || "-"} />
                <Info label="Perawatan" value={detail?.perawatanDilakukan || "-"} containerClassName="col-span-full" />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsEditingPemanfaatan(true)}>Edit</Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Tanggal Awal Penggunaan"
                  type="date"
                  value={pemanfaatanForm.tanggalAwalPenggunaan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, tanggalAwalPenggunaan: e.target.value }))}
                  required
                />
                <Input
                  label="Tanggal Akhir Penggunaan"
                  type="date"
                  value={pemanfaatanForm.tanggalAkhirPenggunaan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, tanggalAkhirPenggunaan: e.target.value }))}
                  required
                />
                <Input
                  label="Total Area Dikerjakan (ha)"
                  type="number"
                  value={pemanfaatanForm.totalAreaDikerjakan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, totalAreaDikerjakan: e.target.value }))}
                  required
                />
                <Select
                  label="Kondisi Alsintan"
                  options={kondisiOptions}
                  value={pemanfaatanForm.kondisiAlsintan}
                  onChange={(val) => setPemanfaatanForm((f) => ({ ...f, kondisiAlsintan: val }))}
                  required
                />
                <Input
                  label="Jenis Alsintan"
                  value={pemanfaatanForm.jenisAlsintan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, jenisAlsintan: e.target.value }))}
                  required
                />
                <Input
                  label="Merek Alsintan"
                  value={pemanfaatanForm.merekAlsintan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, merekAlsintan: e.target.value }))}
                  required
                />
                <Input
                  label="Pengguna"
                  value={pemanfaatanForm.pengguna}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, pengguna: e.target.value }))}
                  required
                />
                <Input
                  label="Lokasi"
                  value={pemanfaatanForm.lokasi}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, lokasi: e.target.value }))}
                  required
                />
                <Input
                  label="Perawatan Dilakukan"
                  value={pemanfaatanForm.perawatanDilakukan}
                  onChange={(e) => setPemanfaatanForm((f) => ({ ...f, perawatanDilakukan: e.target.value }))}
                  className="col-span-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePemanfaatan} disabled={savingPemanfaatan}>
                  Simpan
                </Button>
              </div>
            </>
          )}
        </div>
      </Accordion>

      <Accordion title={(
        <div className="flex items-center gap-2">
          <FileInput className="w-4 h-4 text-success-normal" />
          <span>Laporan Input Kondisi dan Pemanfaatan Task</span>
        </div>
      )}>
        <div className="p-4 space-y-3">
          {!isEditingLaporan && isLaporanFilled ? (
            <>
              {/* Row: Pemanfaatan */}
              <div className="w-full rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-success-normal" />
                  <div>
                    <div className="text-base font-medium">Laporan Pemanfaatan</div>
                    <div className="text-xs text-muted-foreground">
                      {currentPemanfaatan ? (
                        <>Version: {new Date(currentPemanfaatan.version).toLocaleString()}</>
                      ) : (
                        <>Format PDF</>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-success-normal border-success-normal hover:bg-success-normal/10"
                  onClick={() => openDocPreview({ type: 'PEMANFAATAN' })}
                >
                  Preview
                </Button>
              </div>
              {/* Row: Kondisi */}
              <div className="w-full rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-success-normal" />
                  <div>
                    <div className="text-base font-medium">Laporan Kondisi</div>
                    <div className="text-xs text-muted-foreground">
                      {currentKondisi ? (
                        <>Version: {new Date(currentKondisi.version).toLocaleString()}</>
                      ) : (
                        <>Format JPG</>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-success-normal border-success-normal hover:bg-success-normal/10"
                  onClick={() => openDocPreview({ type: 'KONDISI' })}
                >
                  Preview
                </Button>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setIsEditingLaporan(true)}>
                  {currentKondisi || currentPemanfaatan ? 'Edit' : 'Upload'}
                </Button>
              </div>
              {/* No extra edit button; action button above toggles edit */}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Uploader
                  name="kondisiFile"
                  multiple={false}
                  label="Upload Laporan Kondisi (JPG/PNG)"
                  type="file"
                  extensions={["jpg","jpeg","png"]}
                  files={showKondisiExisting ? "/kondisi_dummy.png" : undefined}
                  onDelete={() => { setShowKondisiExisting(false); setKondisiFile(null); }}
                  onChange={(file) => { setShowKondisiExisting(false); setKondisiFile(file); }}
                  required
                />
                <Uploader
                  name="pemanfaatanFile"
                  multiple={false}
                  label="Upload Laporan Pemanfaatan (PDF)"
                  type="file"
                  extensions={["pdf"]}
                  files={showPemanfaatanExisting ? "/pemanfaatan_dummy.pdf" : undefined}
                  onDelete={() => { setShowPemanfaatanExisting(false); setPemanfaatanFile(null); }}
                  onChange={(file) => { setShowPemanfaatanExisting(false); setPemanfaatanFile(file); }}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUploadLaporan} disabled={(!kondisiFile && !pemanfaatanFile) || uploadingLaporan}>
                  Upload
                </Button>
              </div>
            </>
          )}
        </div>
      </Accordion>

      {/* Riwayat Laporan */}
      <Accordion title={(
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-success-normal" />
          <span>History Laporan</span>
        </div>
      )}>
        <div className="p-4 space-y-3">
          {(() => {
            const pemanfaatan = (detail?.documents || []).filter(d => d.type === 'PEMANFAATAN');
            const kondisi = (detail?.documents || []).filter(d => d.type === 'KONDISI');
            return (
              <div className="space-y-5">
                <div>
                  <div className="text-base font-semibold mb-2">History Laporan Pemanfaatan</div>
                  {pemanfaatan.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Tidak ada riwayat.</div>
                  ) : (
                    <div className="space-y-2">
                      {pemanfaatan.map((doc) => (
                        <div key={doc.document_id} className="rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="text-success-normal" />
                            <div className="text-xs text-muted-foreground">Version: {new Date(doc.version).toLocaleString()}</div>
                          </div>
                          <Button variant="outline" className="text-success-normal border-success-normal hover:bg-success-normal/10" onClick={() => openDocPreview(doc)}>Preview</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-semibold mb-2">History Laporan Kondisi</div>
                  {kondisi.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Tidak ada riwayat.</div>
                  ) : (
                    <div className="space-y-2">
                      {kondisi.map((doc) => (
                        <div key={doc.document_id} className="rounded-md border bg-neutral-50 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="text-success-normal" />
                            <div className="text-xs text-muted-foreground">Version: {new Date(doc.version).toLocaleString()}</div>
                          </div>
                          <Button variant="outline" className="text-success-normal border-success-normal hover:bg-success-normal/10" onClick={() => openDocPreview(doc)}>Preview</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </Accordion>

      {previewPdf && (
        <FilePreview file={previewPdf} onClose={() => setPreviewPdf(null)} />
      )}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] text-black" onClick={() => setPreviewImage(null)}>
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full h-[90vh] mx-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-success-normal" />
                <div>
                  <h3 className="text-lg font-semibold">Image Preview</h3>
                  <p className="text-sm text-gray-600">{previewImage?.type || 'Image'} ({((previewImage?.size || 0) / (1024 * 1024)).toFixed(2)} MB)</p>
                </div>
              </div>
              <button onClick={() => setPreviewImage(null)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <ImagePreview blob={previewImage} className="max-h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlsintanDetail;
