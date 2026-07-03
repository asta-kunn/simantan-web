import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainCard from "@/components/common/MainCard";
import { FileText, PlusCircle, CheckCircle, Clock } from "lucide-react";
import mainInstance from "@/api/instances/main.instance";
import { Button } from "@/components/Dexain";
import { Stepper } from "@/components/Dexain";

const PetaniDashboard = () => {
  const navigate = useNavigate();
  const [usulan, setUsulan] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsulan, resPengaduan] = await Promise.all([
          mainInstance.get('/usulan-cpcl'),
          mainInstance.get('/pengaduan') 
        ]);
        setUsulan(resUsulan);
        setPengaduan(resPengaduan);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const generateStepperItems = (status) => {
    const isRejected = status === 'REJECTED';
    
    const getStepState = (stepKey) => {
      if (isRejected) return 'error';
      const statusOrder = ['PENDING', 'VERIFIKASI_AWAL', 'VALIDASI_LAPANGAN', 'SK_DITERBITKAN'];
      const currentIndex = statusOrder.indexOf(status);
      const stepIndex = statusOrder.indexOf(stepKey);

      if (stepIndex < currentIndex) return 'success';
      if (stepIndex === currentIndex) return 'progress';
      return 'disable';
    };

    return [
      {
        title: "Pengajuan Usulan",
        description: "Usulan diterima sistem",
        state: getStepState('PENDING'),
        icon: FileText
      },
      {
        title: "Verifikasi Awal",
        description: "Dokumen disetujui",
        state: getStepState('VERIFIKASI_AWAL'),
        icon: Clock
      },
      {
        title: "Validasi Lapangan",
        description: "Data lapangan sesuai",
        state: getStepState('VALIDASI_LAPANGAN'),
        icon: CheckCircle
      },
      {
        title: "SK Dinas",
        description: "Penetapan SK Usulan",
        state: getStepState('SK_DITERBITKAN'),
        icon: CheckCircle
      }
    ];
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
        <div>
          <h2 className="text-xl font-bold">Dashboard Petani</h2>
          <p className="text-muted-foreground text-sm">Pantau pengajuan usulan dan pengaduan Anda</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/usulan-cpcl/new')} className="gap-2"><PlusCircle size={16}/> Buat Usulan</Button>
          <Button onClick={() => navigate('/pengaduan/new')} variant="outline" className="gap-2"><PlusCircle size={16}/> Buat Pengaduan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Usulan CPCL */}
        <MainCard title="Status Usulan CPCL">
          <div className="space-y-6">
            {usulan.map((tiket) => (
              <div key={tiket.id} className="p-4 border rounded-lg bg-neutral-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {/* PERBAIKAN: Gunakan camelCase (nomorTiket, jenisAlsintanUsulan) */}
                    <h4 className="font-bold text-primary-normal">{tiket.nomorTiket}</h4>
                    <span className="text-sm font-medium">{tiket.jenisAlsintanUsulan} ({tiket.jumlahUsulanAlsintan} Unit)</span>
                  </div>
                  {/* PERBAIKAN: Gunakan createdAt */}
                  <span className="text-xs text-muted-foreground">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                
                <div className="mt-4 px-2">
                  <Stepper 
                    orientation="horizontal" 
                    stepItem={generateStepperItems(tiket.status)} 
                  />
                </div>

                {tiket.tanggapanAdmin && (
                  <div className="mt-4 text-sm bg-white p-3 rounded border">
                    <strong>Catatan Petugas:</strong> {tiket.tanggapanAdmin}
                  </div>
                )}
              </div>
            ))}
            {usulan.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">Belum ada usulan.</p>}
          </div>
        </MainCard>

        {/* Kolom Kanan: Pengaduan */}
        <MainCard title="Riwayat Pengaduan">
          <div className="space-y-3">
            {pengaduan.map((tiket) => (
              <div key={tiket.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between">
                  {/* PERBAIKAN: Gunakan camelCase */}
                  <span className="font-bold text-sm text-gray-700">{tiket.nomorTiket}</span>
                  <span className="text-xs text-gray-500">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                <p className="text-sm mt-2 font-medium">{tiket.kategoriPengaduan}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tiket.deskripsi}</p>
                
                <div className="mt-3 pt-3 border-t">
                  {tiket.tanggapanPetugas ? (
                    <div className="text-sm text-success-normal bg-success-normal/10 p-2 rounded">
                      <strong>Tanggapan:</strong> {tiket.tanggapanPetugas}
                    </div>
                  ) : (
                    <span className="text-xs text-warning-normal bg-warning-normal/10 px-2 py-1 rounded">Menunggu Tanggapan Admin</span>
                  )}
                </div>
              </div>
            ))}
            {pengaduan.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">Belum ada pengaduan.</p>}
          </div>
        </MainCard>
      </div>
    </div>
  );
};

export default PetaniDashboard;