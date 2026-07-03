import React, { useEffect, useState } from "react";
import MainCard from "@/components/common/MainCard";
import { Check, MessageSquare, Ticket, X } from "lucide-react";
import mainInstance from "@/api/instances/main.instance";
import { Button, Input } from "@/components/Dexain";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("USULAN"); 
  const [dataUsulan, setDataUsulan] = useState([]);
  const [dataPengaduan, setDataPengaduan] = useState([]);
  const [tanggapan, setTanggapan] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "USULAN") {
        const res = await mainInstance.get('/usulan-cpcl');
        setDataUsulan(res);
      } else {
        const res = await mainInstance.get('/pengaduan');
        setDataPengaduan(res);
      }
    } catch (err) {}
  };

  const handleUpdateUsulan = async (id, nextStatus) => {
    try {
      await mainInstance.patch(`/usulan-cpcl/${id}/status`, {
        status: nextStatus,
        tanggapan: tanggapan[id] || "Telah diproses oleh sistem."
      });
      toast.success("Status Usulan berhasil diperbarui");
      fetchData();
    } catch (e) {
      toast.error("Gagal memproses tiket");
    }
  };

  const handleBalasPengaduan = async (id) => {
    try {
      // Pastikan property body ini sesuai dengan yg di-handle di Controller backend
      await mainInstance.patch(`/pengaduan/${id}/tanggapan`, {
        tanggapan_petugas: tanggapan[id]
      });
      toast.success("Tanggapan berhasil dikirim");
      fetchData();
    } catch (e) {
      toast.error("Gagal mengirim tanggapan");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <MainCard title="Control Panel Administrator" subtitle="Dashboard" badgeTitle="Hak Akses" badgeSubtitle="Admin">
        <div className="flex gap-4 border-b pb-4 mb-6">
          <Button 
            variant={activeTab === "USULAN" ? "default" : "outline"} 
            onClick={() => setActiveTab("USULAN")}
            className="gap-2"
          >
            <Ticket size={16} /> Usulan CPCL
          </Button>
          <Button 
            variant={activeTab === "PENGADUAN" ? "default" : "outline"} 
            onClick={() => setActiveTab("PENGADUAN")}
            className="gap-2"
          >
            <MessageSquare size={16} /> Pengaduan
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg">
            <thead className="text-xs uppercase bg-neutral-100 border-b">
              <tr>
                <th className="px-6 py-3">No Tiket / Tgl</th>
                <th className="px-6 py-3">{activeTab === "USULAN" ? "Pengaju" : "Pelapor"}</th>
                <th className="px-6 py-3">Detail</th>
                {activeTab === "USULAN" && <th className="px-6 py-3">Status Saat Ini</th>}
                <th className="px-6 py-3 text-center">Aksi / Tanggapan</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "USULAN" ? (
                dataUsulan.map((tiket) => (
                  <tr key={tiket.id} className="bg-white border-b hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-normal">{tiket.nomorTiket}</span><br/>
                      <span className="text-xs text-muted-foreground">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                    </td>
                    {/* PERBAIKAN: Gunakan camelCase untuk namaKetua dll */}
                    <td className="px-6 py-4">{tiket.namaKetua} <br/><span className="text-xs text-muted-foreground">{tiket.desa}</span></td>
                    <td className="px-6 py-4">{tiket.jenisAlsintanUsulan} ({tiket.jumlahUsulanAlsintan} Unit)</td>
                    <td className="px-6 py-4 font-semibold">{tiket.status}</td>
                    <td className="px-6 py-4">
                      {tiket.status !== 'SK_DITERBITKAN' && tiket.status !== 'REJECTED' ? (
                        <div className="flex flex-col gap-2 min-w-[250px]">
                          <Input 
                            placeholder="Catatan..." 
                            value={tanggapan[tiket.id] || ''} 
                            onChange={(e) => setTanggapan(prev => ({...prev, [tiket.id]: e.target.value}))}
                          />
                          <div className="flex gap-2">
                            {tiket.status === 'PENDING' && (
                              <Button size="sm" className="w-full bg-success-normal hover:bg-success-dark text-xs" onClick={() => handleUpdateUsulan(tiket.id, 'VERIFIKASI_AWAL')}>Setujui Verifikasi</Button>
                            )}
                            {tiket.status === 'VERIFIKASI_AWAL' && (
                              <Button size="sm" className="w-full bg-success-normal hover:bg-success-dark text-xs" onClick={() => handleUpdateUsulan(tiket.id, 'VALIDASI_LAPANGAN')}>Setujui Lapangan</Button>
                            )}
                            {tiket.status === 'VALIDASI_LAPANGAN' && (
                              <Button size="sm" className="w-full bg-primary-normal hover:bg-primary-dark text-xs" onClick={() => handleUpdateUsulan(tiket.id, 'SK_DITERBITKAN')}>Terbitkan SK</Button>
                            )}
                            <Button size="sm" variant="outline" className="border-danger-normal text-danger-normal" onClick={() => handleUpdateUsulan(tiket.id, 'REJECTED')}><X size={14}/></Button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Proses Selesai.</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                dataPengaduan.map((tiket) => (
                  <tr key={tiket.id} className="bg-white border-b hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-normal">{tiket.nomorTiket}</span><br/>
                      <span className="text-xs text-muted-foreground">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                    </td>
                    {/* PERBAIKAN: Gunakan camelCase */}
                    <td className="px-6 py-4">{tiket.namaPelapor} <br/><span className="text-xs text-muted-foreground">{tiket.kontakPelapor}</span></td>
                    <td className="px-6 py-4">
                      <strong>{tiket.kategoriPengaduan}</strong>
                      <p className="text-xs text-muted-foreground line-clamp-2">{tiket.deskripsi}</p>
                    </td>
                    <td className="px-6 py-4">
                      {tiket.tanggapanPetugas ? (
                        <div className="text-sm bg-neutral-100 p-2 rounded">
                          <strong>Balasan:</strong> {tiket.tanggapanPetugas}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 min-w-[250px]">
                          <Input 
                            placeholder="Balas pengaduan..." 
                            value={tanggapan[tiket.id] || ''} 
                            onChange={(e) => setTanggapan(prev => ({...prev, [tiket.id]: e.target.value}))}
                          />
                          <Button size="sm" className="w-full" onClick={() => handleBalasPengaduan(tiket.id)}>Kirim Balasan</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </MainCard>
    </div>
  );
};

export default AdminDashboard;