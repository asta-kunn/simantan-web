import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Button } from "@/components/Dexain";
import { Card } from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { ComponentSlot } from "@/pages/Dashboard/component/ryu";
import { Info } from "@/components/common/Info";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

/**
 * Sheet component documentation and examples
 */
const SheetExample = () => {
  const { openSheet, closeSheet } = useUIStore();

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold">Sheet</h2>
        <i className="text-gray-400 text-lg">
          A slide-out panel component for displaying content with configurable width, position, and actions.
        </i>
      </div>

      <div className="space-y-4">
        {/* Sheet Sizes */}
        <ComponentExample
          title="Sheet Sizes"
          description="Sheet can be opened with different widths: sm, md, and lg"
          code={`import { useUIStore } from "@/stores/uiStore";

const { openSheet } = useUIStore();

// Small Sheet
<Button onClick={() => openSheet({
  title: "Small Sheet",
  description: "A small width sheet",
  width: "sm",
})}>
  Open Small Sheet
</Button>

// Medium Sheet
<Button onClick={() => openSheet({
  title: "Medium Sheet",
  description: "A medium width sheet",
  width: "md",
})}>
  Open Medium Sheet
</Button>

// Large Sheet
<Button onClick={() => openSheet({
  title: "Large Sheet",
  description: "A large width sheet",
  width: "lg",
})}>
  Open Large Sheet
</Button>`}
        >
          <div className="flex gap-2">
            <Button onClick={() => openSheet({
              title: "Small Sheet",
              description: "A small width sheet",
              width: "sm",
            })}>
              Small Sheet
            </Button>
            <Button onClick={() => openSheet({
              title: "Medium Sheet",
              description: "A medium width sheet",
              width: "md",
            })}>
              Medium Sheet
            </Button>
            <Button onClick={() => openSheet({
              title: "Large Sheet",
              description: "A large width sheet",
              width: "lg",
            })}>
              Large Sheet
            </Button>
          </div>
        </ComponentExample>

        {/* Sheet with Complex Content */}
        <ComponentExample
          title="Sheet with Complex Content" 
          description="Sheet with cards, info components, and custom actions"
          code={`import { useUIStore } from "@/stores/uiStore";

const { openSheet } = useUIStore();

<Button onClick={() => openSheet({
  title: "Sheet Title",
  description: "Sheet Description",
  width: "md",
  children: (
    <div className="flex flex-col gap-4">
      <Card title="Information Card" description="Details">
        <div className="grid grid-cols-2 gap-4 p-4">
          <Info label="Category" value="Example" />
          <Info label="Status" value="Active" />
          <Info containerClassName="col-span-full" label="Title" value="Sample Title" />
          <Separator className="col-span-full" />
          <Info label="Reference" value="REF-001" />
        </div>
      </Card>
      <Card
        title="Content Card"
        description="With Actions"
        headerActionElement="button"
      >
        <ComponentSlot containerClassName="h-72 rounded-t-none" />
      </Card>
    </div>
  ),
  primaryButton: "Save Changes",
  secondaryButton: "Cancel",
  buttonPositions: "between",
})}>
  Open Complex Sheet
</Button>`}
        >
          <Button onClick={() => openSheet({
            title: "Sheet Title",
            description: "Sheet Description",
            width: "md",
            children: (
              <div className="flex flex-col gap-4">
                <Card title="Information Card" description="Details">
                  <div className="grid grid-cols-2 gap-4">
                    <Info label="Category" value="Example" />
                    <Info label="Status" value="Active" />
                    <Info containerClassName="col-span-full" label="Title" value="Sample Title" />
                    <Separator className="col-span-full" />
                    <Info label="Reference" value="REF-001" />
                  </div>
                </Card>
                <Card
                  title="Content Card"
                  description="With Actions"
                  headerActionElement="button"
                >
                  <ComponentSlot containerClassName="h-72 rounded-t-none" />
                </Card>
              </div>
            ),
            primaryButton: "Save Changes",
            secondaryButton: "Cancel",
            buttonPositions: "between",
          })}>
            Open Complex Sheet
          </Button>
        </ComponentExample>

        {/* Props Reference */}
        <ComponentExample
          title="Sheet Props Reference"
          description="Available configuration options for the Sheet component"
          code={`Sheet Props:
{
  title: string,            // Sheet header title
  description: string,      // Sheet header description
  width: "sm" | "md" | "lg", // Sheet width variant
  children: ReactNode,       // Sheet main content
  primaryButton: string,    // Primary action button text
  secondaryButton: string,  // Secondary action button text
  buttonPositions: "between" | "end", // Footer button alignment
  onOk: () => void,        // Primary button click handler
  onCancel: () => void,    // Secondary button click handler
}`}
        >
          <div className="prose">
            <p>The Sheet component accepts the following props to customize its appearance and behavior.</p>
          </div>
        </ComponentExample>
      </div>
    </>
  );
};

export default SheetExample;
