/* -------------------------------------------------------------------------- */
/*  StepperExample.jsx – demo properti `line`                                 */
/* -------------------------------------------------------------------------- */
import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Stepper } from "@/components/common/Stepper";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2 as CheckIcon,
  FilePlus2 as UploadIcon,
  FileText as TextIcon,
  MailCheck as MailIcon,
  ShieldCheck as ShieldIcon,
  CircleX as RejectIcon,
} from "lucide-react";

/* mini helpers ------------------------------------------------------------- */
const pill = (txt, cls) => (
  <Badge className={`text-xs font-medium px-3 py-1 ${cls}`}>{txt}</Badge>
);
const dateTxt = (d) => (
  <span className="text-xs text-gray-500 whitespace-nowrap">{d}</span>
);
const ShowDetail = () => (
  <button className="mt-3 inline-flex rounded bg-soft-red px-3 py-1 text-xs font-medium text-primary-normal">
    Show Detail
  </button>
);

/* Basic step items for examples */
const basicSteps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "Step 1",
    description: "This step has been completed",
  },
  {
    icon: UploadIcon,
    state: "progress",
    title: "Step 2",
    description: "This step is in progress",
  },
  {
    icon: RejectIcon,
    state: "error",
    title: "Step 3",
    description: "This step has an error",
  },
  {
    icon: TextIcon,
    state: "disable",
    title: "Step 4",
    description: "This step is disabled",
  },
];

/* Steps with content positioning */
const positionSteps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "Bottom Position",
    description: "Text appears below the circle",
    textPosition: "bottom",
    line: false,
  },
  {
    icon: UploadIcon,
    state: "success",
    title: "Right Position",
    description: "Text appears to the right (default)",
    textPosition: "right",
  },
];

/* Steps with additional content */
const contentSteps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "With Right Content",
    description: "This step shows additional content on the right",
    rightContent: pill("Complete", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: UploadIcon,
    state: "progress",
    title: "With Left Content",
    description: "This step shows additional content below",
    leftContent: <ShowDetail />,
  },
];

/* -------------------------  SECTION A  (1‒5)  ----------------------------- */
const stepsAL = [
  {
    icon: CheckIcon,
    state: "success",
    title: <span className="font-semibold text-success-normal">Pre-Reg Timestamp</span>,
    description: (
      <>
        <div>
          Novia Wulandari <span className="text-gray-500">novia.w@dexagroup.com</span>
        </div>
        <div className="text-gray-500">Submit Pre-Reg Timestamp</div>
        {dateTxt("5 May 2025 16:57")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Submitted", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: UploadIcon,
    state: "success",
    title: (
      <span className="font-semibold text-success-normal">
        Pre-Reg Additional Data Submission <i className="text-gray-400">(optional)</i>
      </span>
    ),
    description: (
      <>
        <div>
          Novia Wulandari <span className="text-gray-500">novia.w@dexagroup.com</span>
        </div>
        <div className="text-gray-500">Submit Pre-Reg Additional Data</div>
        {dateTxt("5 May 2025 16:57")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Submitted", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: TextIcon,
    state: "success",
    title: <span className="font-semibold text-success-normal">Pre-Reg Result BPOM</span>,
    description: (
      <>
        <div>
          Novia Wulandari <span className="text-gray-500">novia.w@dexagroup.com</span>
        </div>
        <div className="text-gray-500">Submit Pre-Reg Result BPOM</div>
        {dateTxt("5 May 2025 16:57")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Submitted", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: MailIcon,
    state: "success",
    title: (
      <span className="font-semibold text-success-normal">
        Approivable Letter (AL) Submission Timestamp
      </span>
    ),
    description: (
      <>
        <div>
          Novia Wulandari <span className="text-gray-500">novia.w@dexagroup.com</span>
        </div>
        <div className="text-gray-500">
          Submit Approivable Letter (AL) Submission Timestamp
        </div>
        {dateTxt("5 May 2025 16:57")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Submitted", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: ShieldIcon,
    state: "success",
    title: (
      <span className="font-semibold text-success-normal">
        Receive Approivable Letter (AL) &amp; Upload Document
      </span>
    ),
    description: (
      <>
        <div>
          Heri Tapiheryu <span className="text-gray-500">heri.tapiheryu@dexagroup.com</span>
        </div>
        <div className="text-gray-500">
          Approve Receive Approivable Letter (AL) &amp; Upload Document
        </div>
        {dateTxt("6 May 2025 09:08")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Approved", "bg-tertiary-normal text-success-normal"),
    tail: true,
  },
];

/* -------------------------  SECTION B  (6‒7)  ----------------------------- */
const stepsNIE = [
  {
    icon: UploadIcon,
    state: "success",
    title: (
      <span className="font-semibold text-success-normal">
        Marketing Authorization (NIE) Submission Timestamp
      </span>
    ),
    description: (
      <>
        <div>
          Novia Wulandari <span className="text-gray-500">novia.w@dexagroup.com</span>
        </div>
        <div className="text-gray-500">
          Submit Marketing Authorization (NIE) Submission Timestamp
        </div>
        {dateTxt("16 May 2025 16:57")}
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Submitted", "bg-tertiary-normal text-success-normal"),
  },
  {
    icon: RejectIcon,
    state: "error",
    title: (
      <span className="font-semibold text-danger-normal">
        Receive NIE &amp; Upload Document
      </span>
    ),
    description: (
      <>
        <div>
          Heri Tapiheryu <span className="text-gray-500">heri.tapiheryu@dexagroup.com</span>
        </div>
        <div className="text-gray-500">Approve Receive NIE &amp; Upload Document</div>
        {dateTxt("6 May 2025 09:08")}
        <div className="mt-2 rounded border bg-gray-50 px-2 py-1 text-sm text-gray-500">
          NIE berikut tidak disetujui BPOM
        </div>
        <ShowDetail />
      </>
    ),
    textPosition: "right",
    rightContent: pill("Rejected", "bg-soft-red text-danger-normal"),
    line: false
  },
];

/* ------------- SECTION  (horizontal approval) ------------- */
const stepsApproval = [
  {
    icon: CheckIcon,
    state: "success",
    title: "Submitted by",
    description: (
      <>
        <div>
          Dito Rido Wibowo <span style={{ color: "#C30000" }}>(dito.wibowo@dexagroup.com)</span>
        </div>
        <div className="text-gray-500">Regulatory Affairs - PT Dexa Medica</div>
      </>
    ),
    textPosition: "bottom",
    rightContent: (
      <div className="text-xs text-gray-500 text-right">
        <div>21 December 2024,</div>
        <div>16:57:00</div>
      </div>
    ),
  },
  {
    icon: CheckIcon,
    state: "success",
    title: "Approved",
    description: (
      <>
        <div>
          Jaya Putra <span style={{ color: "#C30000" }}>(jaya.putra@dexagroup.com)</span>
        </div>
        <div className="text-gray-500">Direct Manager RA - PT Dexa Medica</div>
        <div className="mt-3">
          <div className="text-gray-700">Remarks</div>
          <div>Sudah ok 👍</div>
        </div>
      </>
    ),
    textPosition: "bottom",
    rightContent: (
      <div className="text-xs text-gray-500 text-right">
        <div>21 December 2024,</div>
        <div>16:57:00</div>
      </div>
    ),
    line: false,
  },
];

/* ---------------------------  RENDER  ------------------------------------ */
export default function StepperExample() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Stepper</h2>
      <p className="text-gray-600 mb-6">
        A stepper component that displays a sequence of steps with various states and orientations.
        Supports both vertical and horizontal layouts with customizable content positioning.
      </p>

      {/* Basic Usage */}
      <ComponentExample
        title="Basic Usage"
        description="Basic stepper with different states: success, progress, error, and disabled"
        code={`import { Stepper } from "@/components/common/Stepper";

const steps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "Step 1",
    description: "This step has been completed"
  },
  {
    icon: UploadIcon,
    state: "progress",
    title: "Step 2",
    description: "This step is in progress"
  },
  {
    icon: RejectIcon,
    state: "error",
    title: "Step 3",
    description: "This step has an error"
  },
  {
    icon: TextIcon,
    state: "disable",
    title: "Step 4",
    description: "This step is disabled"
  }
];

<Stepper orientation="vertical" stepItem={steps} />`}
      >
        <Stepper orientation="vertical" stepItem={basicSteps} />
      </ComponentExample>

      {/* Orientation */}
      <ComponentExample
        title="Orientation"
        description="Stepper supports both vertical and horizontal orientations"
        code={`<Stepper orientation="horizontal" stepItem={steps} />
<Stepper orientation="vertical" stepItem={steps} />`}
      >
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <Stepper orientation="horizontal" stepItem={basicSteps.slice(0, 3)} />
          </div>
          <Stepper orientation="vertical" stepItem={basicSteps.slice(0, 3)} />
        </div>
      </ComponentExample>

      {/* Content Positioning */}
      <ComponentExample
        title="Content Positioning"
        description="Control the position of step content using textPosition prop"
        code={`const steps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "Bottom Position",
    description: "Text appears below the circle",
    textPosition: "bottom"
  },
  {
    icon: UploadIcon,
    state: "success",
    title: "Right Position",
    description: "Text appears to the right (default)",
    textPosition: "right"
  }
];

<Stepper orientation="vertical" stepItem={steps} />`}
      >
        <Stepper orientation="vertical" stepItem={positionSteps} />
      </ComponentExample>

      {/* Additional Content */}
      <ComponentExample
        title="Additional Content"
        description="Steps can include additional content using rightContent and leftContent props"
        code={`const steps = [
  {
    icon: CheckIcon,
    state: "success",
    title: "With Right Content",
    description: "This step shows additional content on the right",
    rightContent: <Badge>Complete</Badge>
  },
  {
    icon: UploadIcon,
    state: "progress",
    title: "With Left Content",
    description: "This step shows additional content below",
    leftContent: <button>Show Detail</button>
  }
];

<Stepper orientation="vertical" stepItem={steps} />`}
      >
        <Stepper orientation="vertical" stepItem={contentSteps} />
      </ComponentExample>

      {/* Complex Example */}
      <ComponentExample
        title="Complex Example"
        description="A more complex example showing all features combined"
        code={`// See source for full implementation`}
      >
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-200 px-4 py-2">
            <h4 className="font-medium">Approval Information</h4>
          </div>
          <div className="p-4">
            <Stepper orientation="horizontal" stepItem={stepsApproval} className="pb-4" />
          </div>
          <div className="h-1 bg-gray-300 w-full"></div>
        </div>
      </ComponentExample>

      {/* Props Reference */}
      <div className="mt-12 border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Props Reference</h3>
        
        {/* Component Props */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Stepper Component Props</h4>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Prop</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Default</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border"><code>orientation</code></td>
                <td className="p-2 border">"vertical" | "horizontal"</td>
                <td className="p-2 border">"vertical"</td>
                <td className="p-2 border">The orientation of the stepper</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>stepItem</code></td>
                <td className="p-2 border">StepItem[]</td>
                <td className="p-2 border">[]</td>
                <td className="p-2 border">Array of step items to display</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>className</code></td>
                <td className="p-2 border">string</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step Item Props */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Step Item Props</h4>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Prop</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Default</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border"><code>icon</code></td>
                <td className="p-2 border">ReactComponent</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Icon component to display in the circle</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>state</code></td>
                <td className="p-2 border">"success" | "progress" | "error" | "disable"</td>
                <td className="p-2 border">"disable"</td>
                <td className="p-2 border">Current state of the step</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>title</code></td>
                <td className="p-2 border">ReactNode</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Title of the step</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>description</code></td>
                <td className="p-2 border">ReactNode</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Description text for the step</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>textPosition</code></td>
                <td className="p-2 border">"right" | "bottom"</td>
                <td className="p-2 border">"right"</td>
                <td className="p-2 border">Position of the step content</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>rightContent</code></td>
                <td className="p-2 border">ReactNode</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Additional content to display on the right</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>leftContent</code></td>
                <td className="p-2 border">ReactNode</td>
                <td className="p-2 border">undefined</td>
                <td className="p-2 border">Additional content to display below</td>
              </tr>
              <tr>
                <td className="p-2 border"><code>line</code></td>
                <td className="p-2 border">boolean</td>
                <td className="p-2 border">true</td>
                <td className="p-2 border">Whether to show the connecting line to the next step</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* States Reference */}
        <div>
          <h4 className="font-medium mb-2">States</h4>
          <pre className="bg-gray-100 p-2 rounded">
{`const STATE = {
  success:  { circle: "bg-success-normal text-white", line: "bg-success-normal"  },
  progress: { circle: "bg-warning-normal text-white", line: "bg-warning-normal" },
  error:    { circle: "bg-danger-normal text-white",  line: "bg-danger-normal"  },
  disable:  { circle: "bg-gray-300 text-white",       line: "bg-gray-300"       }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
