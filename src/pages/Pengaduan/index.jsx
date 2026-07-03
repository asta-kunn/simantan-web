import React, { useState } from "react";
import { Accordion, Button, Input, Select, Uploader } from "@/components/Dexain";
import { SendHorizontal, MessageSquareWarning, Ticket, CheckCircle2 } from "lucide-react";
import MainCard from "@/components/common/MainCard";
import mainInstance from "@/api/instances/main.instance";
import { useUIStore } from "@/stores/uiStore";

const PengaduanForm = () => {
  const { addStack, closeStack } = useUIStore();

  const [loading, setLoading] = useState(false);
  const [lampiranFile, setLampiranFile] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);

  const [form, setForm] = useState({
    namaPelapor: "",
    kontakPelapor: "",
    kategoriPengaduan: "",
    deskripsi: "",
  });

  const kategoriOptions = [
    { label: "Kerusakan Alsintan", value: "Kerusakan" },
    { label: "Penyalahgunaan Bantuan", value: "Penyalahgunaan" },
    { label: "Kendala Pelayanan", value: "Pelayanan" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return form.namaPelapor && form.kontakPelapor && form.kategoriPengaduan && form.deskripsi;
  };

  const handleSubmit = async () => {
    addStack({
      title: "Kirim Pengaduan?",
      description: "Pastikan informasi yang Anda berikan valid dan dapat dipertanggungjawabkan.",
      variant: "warning",
      size: "md",
      confirmText: (
        <div className="flex items-center gap-2">Kirim <SendHorizontal className="size-4" /></div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        closeStack();
        setLoading(true);
        try {
          const payload = {
            ...form,
            buktiLampiran: lampiranFile ? "/lampiran_pengaduan.jpg" : null,
          };

          const res = await mainInstance.post(`/pengaduan`, payload);
          
          // Asumsi backend mengembalikan data termasuk nomorTiket
          setSuccessTicket(res.nomorTiket || "TKT-SUCCESS-01"); 
          
          addStack({
            title: "Pengaduan Berhasil Dikirim",
            description: "Silakan simpan nomor tiket Anda untuk melacak status pengaduan.",
            variant: "success",
            isConfirm: true,
          });
        } catch (err) {
          addStack({
            title: "Gagal Mengirim",
            description: "Terjadi kesalahan sistem, silakan coba beberapa saat lagi.",
            variant: "danger",
            isConfirm: true,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Tampilan Jika Berhasil (Success State)
  if (successTicket) {
    return (
      <div className="p-4 max-w-2xl mx-auto mt-10">
        <MainCard className="text-center py-10">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-success-normal" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pengaduan Berhasil Dibuat</h2>
          <p className="text-muted-foreground mb-6">
            Terima kasih atas laporan Anda. Kami akan segera menindaklanjuti informasi yang diberikan.
          </p>
          <div className="bg-neutral-50 border rounded-lg p-4 inline-block min-w-[300px]">
            <div className="text-sm text-muted-foreground mb-1">Nomor Tiket Anda:</div>
            <div className="text-xl font-bold tracking-widest text-primary-normal flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" />
              {successTicket}
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => window.location.reload()} variant="outline">Buat Laporan Baru</Button>
            <Button onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
          </div>
        </MainCard>
      </div>
    );
  }

  // Tampilan Form Input
  return (
    <div className="p-4 space-y-4">
      <MainCard
        title="Layanan Pengaduan"
        subtitle="Formulir"
        badgeTitle="Laporan"
        badgeSubtitle="Masyarakat"
      >
        <div className="text-sm text-muted-foreground">
          Sampaikan keluhan, pelaporan kerusakan, atau indikasi penyalahgunaan secara aman. Identitas pelapor akan dijaga kerahasiaannya jika diperlukan.
        </div>
      </MainCard>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-4 h-4 text-warning-normal" />
            <span>Detail Pengaduan</span>
          </div>
        }
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Pelapor"
              value={form.namaPelapor}
              onChange={(e) => handleChange("namaPelapor", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              required
            />
            <Input
              label="Email / No HP"
              value={form.kontakPelapor}
              onChange={(e) => handleChange("kontakPelapor", e.target.value)}
              placeholder="Kontak yang dapat dihubungi..."
              required
            />
            <Select
              label="Kategori Pengaduan"
              options={kategoriOptions}
              value={form.kategoriPengaduan}
              onChange={(val) => handleChange("kategoriPengaduan", val)}
              required
            />
            <Input
              label="Deskripsi Kejadian / Laporan"
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              placeholder="Ceritakan secara detail terkait pengaduan Anda..."
              className="col-span-full"
              required
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <Uploader
              name="lampiranFile"
              multiple={false}
              label="Upload Bukti Lampiran (Opsional - JPG/PNG/PDF)"
              type="file"
              extensions={["jpg", "jpeg", "png", "pdf"]}
              files={lampiranFile ? "lampiran.jpg" : undefined}
              onDelete={() => setLampiranFile(null)}
              onChange={(file) => setLampiranFile(file)}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="w-full md:w-auto"
            >
              {loading ? "Memproses..." : "Kirim Laporan"}
            </Button>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default PengaduanForm;