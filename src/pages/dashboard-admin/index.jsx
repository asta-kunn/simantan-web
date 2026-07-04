import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainCard from "@/components/common/MainCard";
import { MessageSquare, Ticket, X, ClipboardList, Search, Eye } from "lucide-react";
import mainInstance from "@/api/instances/main.instance";
import { Button, Input, Select } from "@/components/Dexain"; // Pastikan komponen Select tersedia
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("USULAN"); 
  const [dataUsulan, setDataUsulan] = useState([]);
  const [dataPengaduan, setDataPengaduan] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]); 
  
  const [tanggapan, setTanggapan] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); 
  
  // STATE BARU: Untuk menyimpan tipe laporan yang sedang dilihat (Default: APBN)
  const [reportType, setReportType] = useState("APBN");

  // TAMBAHKAN reportType ke dalam dependency array agar saat dropdown diganti, data otomatis ter-refresh
  useEffect(() => {
    fetchData();
    if (activeTab !== "LAPORAN") {
      setSearchTerm("");
    }
  }, [activeTab, reportType]);

  const fetchData = async () => {
    try {
      if (activeTab === "USULAN") {
        const res = await mainInstance.get('/usulan-cpcl');
        setDataUsulan(res || []);
      } else if (activeTab === "PENGADUAN") {
        const res = await mainInstance.get('/pengaduan');
        setDataPengaduan(res || []);
      } else if (activeTab === "LAPORAN") {
        // PERBAIKAN: Kirimkan parameter type ke backend
        const res = await mainInstance.get('/reports', { 
          params: { type: reportType } 
        });
        setDataLaporan(res || []);
      }
    } catch (err) {
      console.error("Gagal mengambil data", err);
    }
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
      await mainInstance.patch(`/pengaduan/${id}/tanggapan`, {
        tanggapan_petugas: tanggapan[id]
      });
      toast.success("Tanggapan berhasil dikirim");
      fetchData();
    } catch (e) {
      toast.error("Gagal mengirim tanggapan");
    }
  };

  const filteredLaporan = useMemo(() => {
    if (!searchTerm) return dataLaporan;
    const lowerSearch = searchTerm.toLowerCase();
    return dataLaporan.filter(item => 
      (item.namaPoktan?.toLowerCase().includes(lowerSearch)) ||
      (item.kelurahanDesa?.toLowerCase().includes(lowerSearch)) ||
      (item.jenisAlsintan?.toLowerCase().includes(lowerSearch))
    );
  }, [dataLaporan, searchTerm]);

  return (
    <div className="p-4 space-y-4">
      <MainCard title="Control Panel Administrator" subtitle="Dashboard" badgeTitle="Hak Akses" badgeSubtitle="Admin">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
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
            <Button 
              variant={activeTab === "LAPORAN" ? "default" : "outline"} 
              onClick={() => setActiveTab("LAPORAN")}
              className="gap-2"
            >
              <ClipboardList size={16} /> Laporan Alsintan
            </Button>
          </div>

          {activeTab === "LAPORAN" && (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Total: {filteredLaporan.length} Data
              </span>
              
              {/* FITUR BARU: Dropdown untuk memilih Tipe Laporan */}
              <div className="w-full sm:w-32">
                 <select 
                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   value={reportType}
                   onChange={(e) => setReportType(e.target.value)}
                 >
                   <option value="APBN">APBN</option>
                   <option value="APBD">APBD</option>
                 </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 w-full"
                  placeholder="Cari Poktan / Desa / Jenis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg">
            <thead className="text-xs uppercase bg-neutral-100 border-b">
              {activeTab === "LAPORAN" ? (
                <tr>
                  <th className="px-6 py-3">ID Poktan / Tgl Awal</th>
                  <th className="px-6 py-3">Info Kelompok Tani</th>
                  <th className="px-6 py-3">Detail Alsintan</th>
                  <th className="px-6 py-3">Status Laporan</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-3">No Tiket / Tgl</th>
                  <th className="px-6 py-3">{activeTab === "USULAN" ? "Pengaju" : "Pelapor"}</th>
                  <th className="px-6 py-3">Detail</th>
                  {activeTab === "USULAN" && <th className="px-6 py-3">Status Saat Ini</th>}
                  <th className="px-6 py-3 text-center">Aksi / Tanggapan</th>
                </tr>
              )}
            </thead>
            <tbody>
              {/* RENDER TAB USULAN */}
              {activeTab === "USULAN" && dataUsulan.map((tiket) => (
                  <tr key={tiket.id} className="bg-white border-b hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-normal">{tiket.nomorTiket}</span><br/>
                      <span className="text-xs text-muted-foreground">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4">{tiket.namaKetua} <br/><span className="text-xs text-muted-foreground">{tiket.desa}</span></td>
                    <td className="px-6 py-4">{tiket.jenisAlsintanUsulan} ({tiket.jumlahUsulanAlsintan} Unit)</td>
                    <td className="px-6 py-4 font-semibold">{tiket.status}</td>
                    <td className="px-6 py-4">
                      {tiket.status !== 'PENYALURAN_BANTUAN' && tiket.status !== 'REJECTED' ? (
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
                            {tiket.status === 'SK_DITERBITKAN' && (
                              <Button size="sm" className="w-full bg-success-normal hover:bg-success-dark text-xs" onClick={() => handleUpdateUsulan(tiket.id, 'PENYALURAN_BANTUAN')}>Salurkan Bantuan</Button>
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
              }

              {/* RENDER TAB PENGADUAN */}
              {activeTab === "PENGADUAN" && dataPengaduan.map((tiket) => (
                  <tr key={tiket.id} className="bg-white border-b hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-normal">{tiket.nomorTiket}</span><br/>
                      <span className="text-xs text-muted-foreground">{new Date(tiket.createdAt).toLocaleDateString('id-ID')}</span>
                    </td>
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
              }

              {/* RENDER TAB LAPORAN */}
              {activeTab === "LAPORAN" && (
                filteredLaporan.length > 0 ? (
                  filteredLaporan.map((laporan) => (
                    <tr key={laporan.idPoktan} className="bg-white border-b hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary-normal">{laporan.idPoktan}</span><br/>
                        <span className="text-xs text-muted-foreground">
                          {laporan.tanggalAwalPenggunaan ? new Date(laporan.tanggalAwalPenggunaan).toLocaleDateString('id-ID') : 'Belum Mulai'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{laporan.namaPoktan}</div>
                        <div className="text-xs text-muted-foreground">Ketua: {laporan.ketuaPoktan}</div>
                        <div className="text-xs text-muted-foreground">Desa: {laporan.kelurahanDesa}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{laporan.jenisAlsintan || '-'}</div>
                        <div className="text-xs text-muted-foreground">Merek: {laporan.merekAlsintan || '-'}</div>
                        <div className="mt-1">
                          {laporan.kondisiAlsintan === 'Operasional' ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-success-normal/10 text-success-normal">Operasional</span>
                          ) : laporan.kondisiAlsintan ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-danger-normal/10 text-danger-normal">{laporan.kondisiAlsintan}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {laporan.documents && laporan.documents.length > 0 ? (
                           <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">Dokumen Terlampir</span>
                        ) : (
                           <span className="text-xs font-semibold px-2 py-1 rounded bg-neutral-100 text-neutral-600">Menunggu Dokumen</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2 w-full justify-center"
                          onClick={() => navigate(`/alsintan/detail`, { // PERUBAHAN: Ubah path menjadi statis sesuai route FE Anda
                          state: { 
                            idPoktan: laporan.idPoktan, 
                            type: laporan.type || reportType, 
                            masterData: laporan 
                          } 
                        })}
                        >
                          <Eye size={14}/> Lihat Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                      Data Laporan {reportType} tidak ditemukan.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </MainCard>
    </div>
  );
};

export default AdminDashboard;