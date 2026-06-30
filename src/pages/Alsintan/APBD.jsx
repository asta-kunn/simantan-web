import React, { useMemo, useState, useEffect } from "react";
import { Table, Select, Button } from "@/components/Dexain";
import mainInstance from "@/api/instances/main.instance";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL_MAIN || "http://localhost:8080";
const PROVINSI_URL = `${API_BASE}/wilayah/provinsi`;
const KABUPATEN_URL = (provId) => `${API_BASE}/wilayah/kabupaten/${provId}`;
const KECAMATAN_URL = (kabId) => `${API_BASE}/wilayah/kecamatan/${kabId}`;
const POKTAN_URL = (provId, kabId, kecId) => `${API_BASE}/wilayah/poktan/${provId}/${kabId}/${kecId}`;

const AlsintanAPBD = () => { // Ganti jadi AlsintanAPBD di file APBD
  const [filters, setFilters] = useState({
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
  });

  const [data, setData] = useState([]);
  const [allPoktanData, setAllPoktanData] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // States untuk opsi dropdown
  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  
  // States untuk loading dropdown
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const navigate = useNavigate();

  const columns = useMemo(() => [
    { header: "Kel/Desa", accessorKey: "kelurahanDesa", sort: true, filter: "text" },
    { header: "ID Poktan", accessorKey: "idPoktan", sort: true, filter: "text" },
    { header: "Nama Poktan", accessorKey: "namaPoktan", sort: true, filter: "text" },
    { header: "Ketua Poktan", accessorKey: "ketuaPoktan", sort: true, filter: "text" },
    { header: "Alamat Sekretariat", accessorKey: "alamatSekretariat", sort: true, filter: "text" },
    { header: "Status", accessorKey: "status", sort: true, filter: "text" },
  ], []);

  const actions = useMemo(() => [
    {
      label: "Detail",
      icon: <Eye className="w-4 h-4" />,
      buttonVariant: 'ghost',
      onClick: (row) => {
        if (!row?.idPoktan) {
          alert("ID Poktan tidak tersedia.");
          return;
        }
        navigate("/alsintan/detail", { 
          state: { 
            idPoktan: row.idPoktan, 
            type: "APBD", // Ganti "APBD" di file APBD
            masterData: row 
          } 
        });
      },
    },
  ], []);

  const fetchData = async () => {
    if (!filters.kelurahan) return;
    setLoading(true);
    try {
      const result = await mainInstance.get("/reports", {
        params: {
          type: "APBD", // Ganti "APBD" di file APBD
          kel_desa: filters.kelurahan,
        },
      });
      
      const localReports = Array.isArray(result) ? result : result?.data || [];
      
      const filteredScraped = allPoktanData.filter(
        p => p.desa.toUpperCase() === filters.kelurahan.toUpperCase()
      );

      const mergedData = filteredScraped.map(scraped => {
        const foundInDb = localReports.find(db => db.idPoktan === scraped.id_poktan);
        return {
          kelurahanDesa: scraped.desa,
          idPoktan: scraped.id_poktan,
          namaPoktan: scraped.nama_poktan,
          ketuaPoktan: scraped.ketua_poktan,
          alamatSekretariat: scraped.alamat,
          status: foundInDb ? foundInDb.status : "Pending"
        };
      });

      setData(mergedData);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 1. Load Provinsi saat pertama kali render
  useEffect(() => {
    const loadProvinsi = async () => {
      setLoadingProvinsi(true);
      try {
        const res = await fetch(PROVINSI_URL);
        const json = await res.json();
        const options = (json || []).map((d) => ({ label: d.name, value: d.id }));
        setProvinsiOptions(options);
      } catch (e) {
        setProvinsiOptions([]);
      } finally {
        setLoadingProvinsi(false);
      }
    };
    loadProvinsi();
  }, []);

  // 2. Load Kabupaten ketika Provinsi dipilih
  useEffect(() => {
    const loadKabupaten = async () => {
      if (!filters.provinsi) {
        setKabupatenOptions([]);
        return;
      }
      setLoadingKabupaten(true);
      try {
        const res = await fetch(KABUPATEN_URL(filters.provinsi));
        const json = await res.json();
        const options = (json || []).map((d) => ({ label: d.name, value: d.id }));
        setKabupatenOptions(options);
      } catch (e) {
        setKabupatenOptions([]);
      } finally {
        setLoadingKabupaten(false);
      }
    };
    
    // Reset dropdown di bawahnya setiap kali hirarki atas berubah
    setFilters((f) => ({ ...f, kabupaten: "", kecamatan: "", kelurahan: "" }));
    loadKabupaten();
  }, [filters.provinsi]);

  // 3. Load Kecamatan ketika Kabupaten dipilih
  useEffect(() => {
    const loadKecamatan = async () => {
      if (!filters.kabupaten) {
        setKecamatanOptions([]);
        return;
      }
      setLoadingKecamatan(true);
      try {
        const res = await fetch(KECAMATAN_URL(filters.kabupaten));
        const json = await res.json();
        const options = (json || []).map((d) => ({ label: d.name, value: d.id }));
        setKecamatanOptions(options);
      } catch (e) {
        setKecamatanOptions([]);
      } finally {
        setLoadingKecamatan(false);
      }
    };
    
    // Reset dropdown di bawahnya
    setFilters((f) => ({ ...f, kecamatan: "", kelurahan: "" }));
    loadKecamatan();
  }, [filters.kabupaten]);

  // 4. Load Kelurahan/Desa dan Data Poktan ketika Kecamatan dipilih
  useEffect(() => {
    const loadPoktanAndVillages = async () => {
      if (!filters.kecamatan || !filters.kabupaten || !filters.provinsi) {
        setVillageOptions([]);
        setAllPoktanData([]);
        return;
      }
      setLoadingVillages(true);
      try {
        const res = await fetch(POKTAN_URL(filters.provinsi, filters.kabupaten, filters.kecamatan));
        const json = await res.json();
        
        setAllPoktanData(json || []);
        
        const uniqueVillages = [...new Set((json || []).map(p => p.desa))];
        const options = uniqueVillages.map(v => ({ label: v, value: v.toUpperCase() }));
        
        setVillageOptions(options);
      } catch (e) {
        setVillageOptions([]);
        setAllPoktanData([]);
      } finally {
        setLoadingVillages(false);
      }
    };
    
    // Reset dropdown kelurahan
    setFilters((f) => ({ ...f, kelurahan: "" }));
    loadPoktanAndVillages();
  }, [filters.kecamatan, filters.kabupaten, filters.provinsi]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Input Laporan Pemanfaatan & Kondisi Alsintan APBD</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Select
          label="Provinsi"
          options={provinsiOptions}
          placeholder="Pilih Provinsi"
          value={filters.provinsi}
          onChange={(val) => setFilters((f) => ({ ...f, provinsi: val }))}
          searchable
          loading={loadingProvinsi}
          required
        />
        <Select
          label="Kabupaten"
          options={kabupatenOptions}
          placeholder="Pilih Kabupaten"
          value={filters.kabupaten}
          onChange={(val) => setFilters((f) => ({ ...f, kabupaten: val }))}
          searchable
          loading={loadingKabupaten}
          disabled={!filters.provinsi}
          required
        />
        <Select
          label="Kecamatan"
          options={kecamatanOptions}
          placeholder="Pilih Kecamatan"
          value={filters.kecamatan}
          onChange={(val) => setFilters((f) => ({ ...f, kecamatan: val }))}
          searchable
          loading={loadingKecamatan}
          disabled={!filters.kabupaten}
          required
        />
        <Select
          label="Kelurahan / Desa"
          options={villageOptions}
          placeholder="Pilih Kelurahan/Desa"
          value={filters.kelurahan}
          onChange={(val) => setFilters((f) => ({ ...f, kelurahan: val }))}
          searchable
          loading={loadingVillages}
          disabled={!filters.kecamatan}
          required
        />
      </div>

      <div className="flex justify-end mb-3">
        <Button onClick={fetchData} disabled={!filters.kelurahan}>Cari</Button>
      </div>

      <Table
        data={data}
        columns={columns}
        actions={actions}
        actionType="button"
        actionVariant="icon"
        isLoading={loading}
        pagination
      />
    </div>
  );
};

export default AlsintanAPBD;