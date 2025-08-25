
import { lazy } from "react";

// Lazy imports for pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Approval = lazy(
  () => import("@/pages/ProductRegistration/Approval/index")
);
const ApprovalDetail = lazy(
  () => import("@/pages/ProductRegistration/Approval/detail")
);
const DeveloperDocs = lazy(() => import("@/pages/DeveloperDocs/index"));

// Alsintan Module
const Alsintan = lazy(() => import("@/pages/Alsintan"));
const AlsintanAPBN = lazy(() => import("@/pages/Alsintan/APBN"));
const AlsintanAPBD = lazy(() => import("@/pages/Alsintan/APBD"));
const AlsintanDetail = lazy(() => import("@/pages/Alsintan/Detail"));

// Existing Product Improvement
const ExistingProductImprovement = lazy(
  () => import("@/pages/ExistingProductImprovement/index")
);
const EPINewRequestList = lazy(
  () => import("@/pages/ExistingProductImprovement/NewRequest")
);
const EPINewRequestForm = lazy(
  () =>
    import(
      "@/pages/ExistingProductImprovement/NewRequest/ProposalRequest/index"
    )
);
const PackagingDesignForm = lazy(
  () =>
    import(
      "@/pages/ExistingProductImprovement/NewRequest/ProposalRequest/PackagingDesign/index"
    )
);
const EPINewRequestDetail = lazy(
  () =>
    import("@/pages/ExistingProductImprovement/NewRequest/ProposalDetail/index")
);
const ProjectManagement = lazy(
  () => import("@/pages/ExistingProductImprovement/ProjectManagement/index")
);
const ProjectManagementDetail = lazy(
  () => import("@/pages/ExistingProductImprovement/ProjectManagement/detail")
);

// Product Registration
const RegistrationHomepage = lazy(
  () => import("@/pages/ProductRegistration/Homepage/index")
);
const RegistrationVariationNotification = lazy(
  () =>
    import(
      "@/pages/ProductRegistration/RegistrationVariationNotification/index"
    )
);
const RegistrationVariationNotificationSubmissionDetail = lazy(
  () =>
    import(
      "@/pages/ProductRegistration/RegistrationVariationNotification/pages/Submission/Detail/index"
    )
);
const RegistrationMarketingAuthorizationDatabase = lazy(
  () =>
    import("@/pages/ProductRegistration/MarketingAuthorizationDatabase/index")
);
const NewProductRegistration = lazy(
  () => import("@/pages/ProductRegistration/NewProductRegistration/index")
);
const NewProductRegistrationSubmissionDetail = lazy(
  () =>
    import(
      "@/pages/ProductRegistration/NewProductRegistration/Submission/Detail/index"
    )
);

// Master Data Management
const MasterDataManagementHomepage = lazy(
  () => import("@/pages/MasterDataManagement/Homepage/index")
);
const TechnicalService = lazy(
  () => import("@/pages/MasterDataManagement/TechnicalService/ListTask/index")
);
const TaskListQA = lazy(
  () => import("@/pages/MasterDataManagement/QA/ListTask/index")
);
const DetailTaskQA = lazy(
  () => import("@/pages/MasterDataManagement/QA/DetailTask/index")
);
const DetailTaskItemB = lazy(
  () =>
    import(
      "@/pages/MasterDataManagement/TechnicalService/DetailTaskItemB/index"
    )
);
const DetailTaskItemBQA = lazy(
  () => import("@/pages/MasterDataManagement/QA/DetailTaskItemB/index")
);
const ItemMaster = lazy(
  () => import("@/pages/MasterDataManagement/ItemMaster/index")
);
const CreateItemSubstitusi = lazy(
  () =>
    import("@/pages/MasterDataManagement/ItemSubstitusi/CreateTaskItem/index")
);
const ListTaskItem = lazy(
  () => import("@/pages/MasterDataManagement/ItemSubstitusi/ListTaskItem/index")
);
const EditItemSubstitusi = lazy(
  () => import("@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/index")
);
const DetailApprovalItemSubstitusi = lazy(
  () =>
    import(
      "@/pages/MasterDataManagement/ItemSubstitusi/ApprovalTaskItem/Detail/index"
    )
);
const ListApprovalItemSubstitution = lazy(
  () =>
    import("@/pages/MasterDataManagement/ItemSubstitusi/ApprovalTaskItem/index")
);

const InactivationManufacturer = lazy(
  () => import("@/pages/MasterDataManagement/InactivationManufacturer/index")
);
const InactivationManufacturerDetail = lazy(
  () => import("@/pages/MasterDataManagement/InactivationManufacturer/Detail/index")
);

// Settings
const Settings = lazy(() => import("@/pages/Settings/index"));
const User = lazy(() => import("@/pages/Settings/MasterData/PositionCodeDepartmentRole/index"));
const Role = lazy(() => import("@/pages/Settings/MasterData/Role/index"));
const Responsibilities = lazy(
  () => import("@/pages/Settings/MasterData/Responsibilities/index")
);
const Menu = lazy(() => import("@/pages/Settings/MasterData/Menu/index"));

// Route definitions
export const allRoutes = [
  // Main
  {
    title: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
    exact: true,
    protected: false,
  },
  // Alsintan Module
  {
    title: "Laporan Pemanfaatan dan Kondisi Alsintan",
    path: "/alsintan",
    component: Alsintan,
    exact: true,
    protected: true,
  },
  {
    title: "Input Laporan Alsintan APBN",
    path: "/alsintan/input-apbn",
    component: AlsintanAPBN,
    exact: true,
    protected: true,
  },
  {
    title: "Input Laporan Alsintan APBD",
    path: "/alsintan/input-apbd",
    component: AlsintanAPBD,
    exact: true,
    protected: true,
  },
  {
    title: "Detail Laporan Alsintan",
    path: "/alsintan/detail",
    component: AlsintanDetail,
    exact: true,
    protected: true,
  },
  {
    title: "Developer Docs",
    path: "/developer-docs",
    component: DeveloperDocs,
    exact: true,
    protected: false,
  },

  // Existing Product Improvement
  {
    path: "/epi",
    component: ExistingProductImprovement,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/new-request",
    component: EPINewRequestList,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/new-request/request/:subCategory",
    component: EPINewRequestForm,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/new-request/request/packaging-design",
    component: PackagingDesignForm,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/new-request/detail",
    component: EPINewRequestDetail,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/project-management",
    component: ProjectManagement,
    exact: true,
    protected: true,
  },
  {
    path: "/epi/project-management/detail",
    component: ProjectManagementDetail,
    exact: true,
    protected: true,
  },

  // Product Registration
  {
    title: "Product Registration",
    path: "/product-registration",
    component: RegistrationHomepage,
    exact: true,
    protected: true,
  },
  {
    title: "Approval",
    path: "/product-registration/approval",
    component: Approval,
    exact: true,
    protected: true,
  },
  {
    title: "Detail",
    path: "/product-registration/approval/detail",
    component: ApprovalDetail,
    exact: true,
    protected: true,
  },
  {
    title: "Registration Variation, Notification & Renewal",
    path: "/product-registration/variation-notification",
    component: RegistrationVariationNotification,
    exact: true,
    protected: true,
  },
  {
    title: "Task Details",
    path: "/product-registration/variation-notification/submission/detail",
    component: RegistrationVariationNotificationSubmissionDetail,
    exact: true,
    protected: true,
  },
  {
    title: "Registration NIE/MA Database",
    path: "/product-registration/marketing-authorization-database",
    component: RegistrationMarketingAuthorizationDatabase,
    exact: true,
    protected: true,
  },
  // Temporary/role-based routes (if needed)
  {
    title: "Registration Variation Notification Ra Manager",
    path: "/product-registration/variation-notification/ra-manager",
    component: RegistrationVariationNotification,
    exact: true,
    protected: true,
  },
  {
    title: "Registration Variation Notification Ra",
    path: "/product-registration/variation-notification/ra",
    component: RegistrationVariationNotification,
    exact: true,
    protected: true,
  },
  {
    title: "Registration Variation Notification Pmo Ra",
    path: "/product-registration/variation-notification/pmo-ra",
    component: RegistrationVariationNotification,
    exact: true,
    protected: true,
  },

  // Product Registration ra support
  {
    title: "Registration Variation Notification Ra Support",
    path: "/product-registration/variation-notification/ra-support",
    component: RegistrationVariationNotification,
    exact: true,
    protected: true,
  },

  // New Product Registration
  {
    title: "New Product Registration",
    path: "/product-registration/new",
    component: NewProductRegistration,
    exact: true,
    protected: true,
  },
  {
    title: "New Product Registration Submission Detail",
    path: "/product-registration/new/submission/detail",
    component: NewProductRegistrationSubmissionDetail,
    exact: true,
    protected: true,
  },

  // Master Data Management
  {
    title: "Master Data Management",
    path: "/master-data-management",
    component: MasterDataManagementHomepage,
    exact: true,
    protected: true,
  },
  {
    title: "Approve Vendor List (TS)",
    path: "/master-data-management/approve-vendor-list",
    component: TechnicalService,
    exact: true,
    protected: true,
  },
  {
    title: "Detail Task",
    path: "/master-data-management/approve-vendor-list/detail",
    component: DetailTaskItemB,
    exact: true,
    protected: true,
  },
  {
    title: "Approve Vendor List (QA)",
    path: "/master-data-management/approval-qa",
    component: TaskListQA,
    exact: true,
    protected: true,
  },
  {
    path: "/master-data-management/detail-task-qa",
    component: DetailTaskQA,
    exact: true,
    protected: true,
  },
  {
    title: "Detail Task",
    path: "/master-data-management/approval-qa/detail",
    component: DetailTaskItemBQA,
    exact: true,
    protected: true,
  },
  {
    title: "Create Item Substitution",
    path: "/master-data-management/item-substitution/create",
    component: CreateItemSubstitusi,
    exact: true,
    protected: true,
  },
  {
    title: "Item Master",
    path: "/master-data-management/item-master",
    component: ItemMaster,
    exact: true,
    protected: true,
  },
  {
    title: "List Item Substitution",
    path: "/master-data-management/item-substitution",
    component: ListTaskItem,
    exact: true,
    protected: true,
  },
  {
    title: "Edit Item Substitution",
    path: "/master-data-management/item-substitution/edit",
    component: EditItemSubstitusi,
    exact: true,
    protected: true,
  },
  {
    title: "Detail Approval Item Substitution",
    path: "/master-data-management/item-substitution/detail",
    component: DetailApprovalItemSubstitusi,
    exact: true,
    protected: true,
  },
  {
    title: "List Approval Item Substitution",
    path: "/master-data-management/list-approval-item-substitution",
    component: ListApprovalItemSubstitution,
    exact: true,
    protected: true,
  },
  {
    title: "Inactivation & Reactivation Manufacturer",
    path: "/master-data-management/inactive-manufacture-list",
    component: InactivationManufacturer,
    exact: true,
    protected: true,
  },
  {
    title: "Detail",
    path: "/master-data-management/inactive-manufacture-list/detail",
    component: InactivationManufacturerDetail,
    exact: true,
    protected: true,
  },
];
