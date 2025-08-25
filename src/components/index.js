// Tree-shakable component exports for better bundle optimization
// Import only what you need to reduce bundle size

// ===== CORE UI COMPONENTS =====
// These are frequently used, so they can be directly exported
export { Button } from "./fields/Button";
export { Input } from "./fields/Input";
export { Card } from "./fields/Card";

// ===== LAZY-LOADED HEAVY COMPONENTS =====
// These components are loaded only when needed
import { lazy } from "react";

// Form components (often used together)
export const Form = lazy(() => import("./fields/Form").then(m => ({ default: m.Form })));
export const Select = lazy(() => import("./fields/Select").then(m => ({ default: m.Select })));
export const TextArea = lazy(() => import("./fields/TextArea").then(m => ({ default: m.TextArea })));
export const DatePicker = lazy(() => import("./fields/DatePicker").then(m => ({ default: m.DatePicker })));
export const RangeDatePicker = lazy(() => import("./fields/RangeDatePicker").then(m => ({ default: m.RangeDatePicker })));

// Table components (heavy, only load when needed)
export const Table = lazy(() => import("./fields/Table/index").then(m => ({ default: m.Table })));

// Modal and Dialog components
export const Modal = lazy(() => import("./global/Modal").then(m => ({ default: m.Modal })));
export const Sheet = lazy(() => import("./global/Sheet").then(m => ({ default: m.Sheet })));
export const Dialog = lazy(() => import("./fields/Dialog").then(m => ({ default: m.Dialog })));
export const ConfirmationModal = lazy(() => import("./global/ConfirmationModal").then(m => ({ default: m.ConfirmationModal })));

// Text editor (very heavy)
export const TextEditor = lazy(() => import("./common/TextEditor").then(m => ({ default: m.TextEditor })));

// ===== GROUPED EXPORTS FOR COMMON USE CASES =====
// UI Kit - Basic components used together
export const UIKit = {
  Button: lazy(() => import("./fields/Button").then(m => ({ default: m.Button }))),
  Input: lazy(() => import("./fields/Input").then(m => ({ default: m.Input }))),
  Card: lazy(() => import("./fields/Card").then(m => ({ default: m.Card }))),
  Badge: lazy(() => import("./fields/Badge").then(m => ({ default: m.Badge }))),
  Alert: lazy(() => import("./fields/Alert").then(m => ({ default: m.Alert }))),
};

// Form Kit - Form-related components
export const FormKit = {
  Form: lazy(() => import("./fields/Form").then(m => ({ default: m.Form }))),
  Input: lazy(() => import("./fields/Input").then(m => ({ default: m.Input }))),
  Select: lazy(() => import("./fields/Select").then(m => ({ default: m.Select }))),
  TextArea: lazy(() => import("./fields/TextArea").then(m => ({ default: m.TextArea }))),
  Checkbox: lazy(() => import("./fields/Checkbox").then(m => ({ default: m.Checkbox }))),
  DatePicker: lazy(() => import("./fields/DatePicker").then(m => ({ default: m.DatePicker }))),
};

// Layout Kit - Layout and navigation components
export const LayoutKit = {
  Tabs: lazy(() => import("./fields/Tabs").then(m => ({ default: m.Tabs }))),
  Accordion: lazy(() => import("./fields/Accordion").then(m => ({ default: m.Accordion }))),
  Divider: lazy(() => import("./fields/Divider").then(m => ({ default: m.Divider }))),
  Breadcrumbs: lazy(() => import("./fields/Breadcrumbs").then(m => ({ default: m.Breadcrumbs }))),
};

// ===== DIRECT EXPORTS FOR LIGHTWEIGHT COMPONENTS =====
// These can be directly exported as they're small
export { Separator } from "./ui/separator";
export { Skeleton } from "./ui/skeleton";
export { Badge } from "./fields/Badge";
export { Checkbox } from "./fields/Checkbox";
export { Divider } from "./fields/Divider";

// ===== UTILITY EXPORTS =====
export { SuggestionInput } from "./common/SuggestionInput";
export { BannerMenu } from "./common/BannerMenu";
export { CardMenu } from "./common/CardMenu";
export { ImagePreview } from "./common/ImagePreview";
export { Info } from "./common/Info";
export { RunningTime } from "./common/RunningTime";

// ===== PROVIDER EXPORTS =====
export { UIProvider } from "./global/UIProvider";

// ===== BACKWARD COMPATIBILITY =====
// Keep the original Dexain export for existing code
export * as Dexain from "./Dexain";

// ===== USAGE EXAMPLES =====
/*
// Instead of importing everything:
// import { Button, Input, Table, TextEditor } from "@/components/Dexain";

// Use specific imports:
import { Button, Input } from "@/components"; // Light components
import { Suspense } from "react";

const MyForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormKit.Form>
        <Button>Submit</Button>
        <Input placeholder="Enter text" />
      </FormKit.Form>
    </Suspense>
  );
};

// Or use grouped imports:
import { FormKit } from "@/components";

const MyFormPage = () => {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <FormKit.Form>
        <FormKit.Input />
        <FormKit.Select />
      </FormKit.Form>
    </Suspense>
  );
};
*/ 