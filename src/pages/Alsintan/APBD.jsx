import React, { useMemo, useState, useEffect } from "react";
import { Table, Select, Input, Button } from "@/components/Dexain";
import mainInstance from "@/api/instances/main.instance";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PROVINSI = "Jawa Barat";
const KABUPATEN = "Bogor";

// Use backend proxy to avoid CORS
const API_BASE = import.meta.env.VITE_API_URL_MAIN || "http://localhost:8080";
const DISTRICTS_URL = `${API_BASE}/wilayah/districts`;
const VILLAGES_URL = (districtCode) => `${API_BASE}/wilayah/villages/${districtCode}`;

const AlsintanAPBD = () => {
  const [filters, setFilters] = useState({
    provinsi: PROVINSI,
    kabupaten: KABUPATEN,
    kecamatan: "",
    kelurahan: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
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
        const detailId = row?.id ?? row?.ID ?? row?.reportId ?? row?.REPORT_ID;
        if (!detailId) {
          alert("ID detail tidak tersedia dari data list. Pastikan API list mengembalikan field 'id'.");
          return;
        }
        navigate("/alsintan/detail", { state: { id: detailId, type: "APBD" } });
      },
    },
  ], []);

  const fetchData = async () => {
    if (!filters.kelurahan) return;
    setLoading(true);
    try {
      const result = await mainInstance.get("/reports", {
        params: {
          type: "APBD",
          kel_desa: filters.kelurahan,
        },
      });
      setData(Array.isArray(result) ? result : result?.data || []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load kecamatan on mount
  useEffect(() => {
    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const res = await fetch(DISTRICTS_URL);
        const json = await res.json();
        const options = (json?.data || []).map((d) => ({ label: d.name, value: d.code }));
        setDistrictOptions(options);
      } catch (e) {
        setDistrictOptions([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, []);

  // Load kelurahan when kecamatan selected
  useEffect(() => {
    const loadVillages = async () => {
      if (!filters.kecamatan) {
        setVillageOptions([]);
        return;
      }
      setLoadingVillages(true);
      try {
        const res = await fetch(VILLAGES_URL(filters.kecamatan));
        const json = await res.json();
        const options = (json?.data || []).map((v) => ({ label: v.name, value: (v.name || "").toUpperCase() }));
        setVillageOptions(options);
      } catch (e) {
        setVillageOptions([]);
      } finally {
        setLoadingVillages(false);
      }
    };
    // reset kelurahan on kecamatan change
    setFilters((f) => ({ ...f, kelurahan: "" }));
    loadVillages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.kecamatan]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Input Laporan Pemanfaatan & Kondisi Alsintan APBD</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Input label="Provinsi" value={filters.provinsi} disabled readOnly />
        <Input label="Kabupaten" value={filters.kabupaten} disabled readOnly />
        <Select
          label="Kecamatan"
          options={districtOptions}
          placeholder="Pilih kecamatan"
          value={filters.kecamatan}
          onChange={(val) => setFilters((f) => ({ ...f, kecamatan: val }))}
          searchable
          loading={loadingDistricts}
        />
        <Select
          label="Kelurahan / Desa"
          options={villageOptions}
          placeholder="Pilih kelurahan/desa"
          value={filters.kelurahan}
          onChange={(val) => setFilters((f) => ({ ...f, kelurahan: val }))}
          searchable
          loading={loadingVillages}
        />
      </div>

      <div className="flex justify-end mb-3">
        <Button onClick={fetchData}>Cari</Button>
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


