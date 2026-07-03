import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, Button, Input, Uploader } from "@/components/Dexain";
import { SendHorizontal, ClipboardList, FileInput, MapPin } from "lucide-react";
import MainCard from "@/components/common/MainCard";
import mainInstance from "@/api/instances/main.instance";
import { useUIStore } from "@/stores/uiStore";

const UsulanCpclForm = () => {
  const { addStack, closeStack } = useUIStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [proposalFile, setProposalFile] = useState(null);

  // State untuk Data Form
  const [form, setForm] = useState({
    namaKelompok: "",
    namaKetua: "",
    kecamatan: "",
    desa: "",
    titikKoordinat: "",
    luasLahan: "",
    jenisAlsintanUsulan: "",
    jumlahUsulanAlsintan: "",
    nikKetua: "",
    noHpKetua: "",
  });

  // PERBAIKAN: Handler diubah agar menerima key field secara spesifik
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      form.namaKelompok &&
      form.namaKetua &&
      form.kecamatan &&
      form.desa &&
      form.jenisAlsintanUsulan &&
      form.jumlahUsulanAlsintan &&
      form.nikKetua &&
      proposalFile
    );
  };

  const handleSubmit = async () => {
    addStack({
      title: "Kirim Usulan CPCL?",
      description: "Pastikan semua data usulan dan dokumen yang diunggah sudah benar.",
      variant: "warning",
      size: "md",
      confirmText: (
        <div className="flex items-center gap-2">
          Kirim Usulan <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        closeStack();
        setLoading(true);
        try {
          const payload = {
            ...form,
            luasLahan: form.luasLahan ? Number(form.luasLahan) : null,
            jumlahUsulanAlsintan: Number(form.jumlahUsulanAlsintan),
            dokumenProposal: proposalFile ? "/proposal_usulan.pdf" : null, // Ganti dengan logic upload backend Anda nantinya
          };

          await mainInstance.post(`/usulan-cpcl`, payload);

          addStack({
            title: "Usulan Berhasil Dikirim",
            description: "Data Usulan CPCL Alsintan telah tersimpan di sistem.",
            variant: "success",
            isConfirm: true,
          });

          navigate(-1);
        } catch (err) {
          addStack({
            title: "Gagal Mengirim Usulan",
            description: "Terjadi kesalahan pada server saat menyimpan data.",
            variant: "danger",
            isConfirm: true,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <MainCard
        title="Formulir Usulan CPCL"
        subtitle="Modul"
        badgeTitle="Alsintan"
        badgeSubtitle="Input Baru"
      >
        <div className="text-sm text-muted-foreground">
          Silakan lengkapi data usulan Calon Petani Calon Lokasi (CPCL) Alsintan dan unggah dokumen proposal pendukung di bawah ini.
        </div>
      </MainCard>

      <Accordion
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-success-normal" />
            <span>Data Kelompok dan Lokasi</span>
          </div>
        }
      >
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Poktan/Gapoktan/UPJA/Brigade"
            value={form.namaKelompok}
            onChange={(e) => handleChange("namaKelompok", e.target.value)} // PERBAIKAN DI SINI
            placeholder="Masukkan nama kelompok..."
            required
          />
          <Input
            label="Nama Ketua"
            value={form.namaKetua}
            onChange={(e) => handleChange("namaKetua", e.target.value)}
            placeholder="Masukkan nama ketua kelompok..."
            required
          />
          <Input
            label="NIK Ketua"
            type="number"
            value={form.nikKetua}
            onChange={(e) => handleChange("nikKetua", e.target.value)}
            placeholder="Masukkan 16 digit NIK..."
            required
          />
          <Input
            label="No HP Ketua"
            type="tel"
            value={form.noHpKetua}
            onChange={(e) => handleChange("noHpKetua", e.target.value)}
            placeholder="Contoh: 08123456789"
          />
          <Input
            label="Kecamatan"
            value={form.kecamatan}
            onChange={(e) => handleChange("kecamatan", e.target.value)}
            required
          />
          <Input
            label="Desa"
            value={form.desa}
            onChange={(e) => handleChange("desa", e.target.value)}
            required
          />
          <Input
            label="Titik Koordinat (Opsional)"
            value={form.titikKoordinat}
            onChange={(e) => handleChange("titikKoordinat", e.target.value)}
            placeholder="Contoh: -6.12345, 106.12345"
            icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
          />
          <Input
            label="Luas Lahan (Hektare)"
            type="number"
            value={form.luasLahan}
            onChange={(e) => handleChange("luasLahan", e.target.value)}
            placeholder="Contoh: 2.5"
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
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Jenis Alsintan Usulan"
              value={form.jenisAlsintanUsulan}
              onChange={(e) => handleChange("jenisAlsintanUsulan", e.target.value)}
              placeholder="Contoh: Traktor Roda 4, Combine Harvester..."
              required
            />
            <Input
              label="Jumlah Usulan (Unit)"
              type="number"
              value={form.jumlahUsulanAlsintan}
              onChange={(e) => handleChange("jumlahUsulanAlsintan", e.target.value)}
              placeholder="Masukkan jumlah unit..."
              required
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <Uploader
              name="proposalFile"
              multiple={false}
              label="Upload Dokumen Proposal (PDF)"
              type="file"
              extensions={["pdf"]}
              files={proposalFile ? "proposal_usulan.pdf" : undefined}
              onDelete={() => setProposalFile(null)}
              onChange={(file) => setProposalFile(file)}
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="w-full md:w-auto"
            >
              {loading ? "Menyimpan..." : "Simpan Usulan"}
            </Button>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default UsulanCpclForm;