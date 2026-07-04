import { lazy } from "react";

// Definisikan konstan role agar tidak typo (sesuai dengan backend NestJS)
const ROLES = {
  ADMIN: "ADMINISTRATOR",
  PETANI: "PETANI",
};

export const allRoutes = [
  // --- DASHBOARD ---
  {
    title: "Dashboard Petani",
    path: "/dashboard-petani",
    component: lazy(() => import("@/pages/dashboard-petani/index.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI], // Hanya Petani
  },
  {
    title: "Dashboard Admin",
    path: "/dashboard-admin",
    component: lazy(() => import("@/pages/dashboard-admin/index.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.ADMIN], // Hanya Admin
  },

  // --- MODUL PETANI (Semua menu muncul untuk petani) ---
  {
    title: "Laporan Pemanfaatan dan Kondisi Alsintan",
    path: "/alsintan",
    component: lazy(() => import("@/pages/Alsintan/index.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI],
  },
  {
    title: "Input Laporan Alsintan APBN",
    path: "/alsintan/input-apbn",
    component: lazy(() => import("@/pages/Alsintan/APBN.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI],
  },
  {
    title: "Input Laporan Alsintan APBD",
    path: "/alsintan/input-apbd",
    component: lazy(() => import("@/pages/Alsintan/APBD.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI],
  },
  {
    title: "Detail Laporan Alsintan",
    path: "/alsintan/detail",
    component: lazy(() => import("@/pages/Alsintan/Detail.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI, ROLES.ADMIN],
  },
  {
    title: "usulan-cpcl",
    path: "/usulan-cpcl",
    component: lazy(() => import("@/pages/usulan-cpcl/index.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI],
  },
  {
    title: "pengaduan",
    path: "/pengaduan",
    component: lazy(() => import("@/pages/Pengaduan/index.jsx")),
    exact: true,
    protected: true,
    roles: [ROLES.PETANI],
  }
];