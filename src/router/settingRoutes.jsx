import { lazy } from "react";

const Settings = lazy(() => import("@/pages/Settings/index"));
const User = lazy(() => import("@/pages/Settings/MasterData/PositionCodeDepartmentRole/index"));
const Menu = lazy(() => import("@/pages/Settings/MasterData/Menu/index"));
const Role = lazy(() => import("@/pages/Settings/MasterData/Role/index"));
const Responsibilities = lazy(
  () => import("@/pages/Settings/MasterData/Responsibilities/index")
);

export const settingRoutes = [
  {
    title: "Settings",
    path: "/settings",
    component: Settings,
    exact: true,
    protected: true,
  },
  {
    title: "Position Code to Department & Role",
    path: "/settings/master-data/position-code/department-role",
    component: User,
    exact: true,
    protected: true,
  },
  {
    title: "Menus",
    path: "/settings/master-data/menu",
    component: Menu,
    exact: true,
    protected: true,
  },
  {
    title: "Roles",
    path: "/settings/master-data/role",
    component: Role,
    exact: true,
    protected: true,
  },
  {
    title: "Responsibilities",
    path: "/settings/master-data/responsibilities",
    component: Responsibilities,
    exact: true,
    protected: true,
  },
];
