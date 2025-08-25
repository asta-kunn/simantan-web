import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample"; // helper wrapper in your docs
import { Tabs } from "@/components/fields/Tabs"; // <— the Tabs we just updated
import { Settings, ClipboardCheck, Bell } from "lucide-react";

const TabsExample = () => {
  /* -------------------------------------------------------------------- */
  /* dataset for every combination                                        */
  /* -------------------------------------------------------------------- */

  // 1. Pill – basic
  const pillBasic = [
    { value: "pb1", label: "Label", content: <p>Panel 1</p> },
    { value: "pb2", label: "Label", content: <p>Panel 2</p> },
    { value: "pb3", label: "Label", content: <p>Panel 3</p> },
    { value: "pb4", label: "Label", content: <p>Panel 4</p> },
  ];

  // 2. Pill – with icons
  const pillIcons = [
    { value: "pi1", label: "Label", icon: Settings, content: <p>Panel 1</p> },
    {
      value: "pi2",
      label: "Label",
      icon: ClipboardCheck,
      content: <p>Panel 2</p>,
    },
    { value: "pi3", label: "Label", icon: Settings, content: <p>Panel 3</p> },
    {
      value: "pi4",
      label: "Label",
      icon: ClipboardCheck,
      content: <p>Panel 4</p>,
    },
  ];

  // 3. Pill – with counts
  const pillCounts = [
    { value: "pc1", label: "Label", count: 99, content: <p>Panel 1</p> },
    { value: "pc2", label: "Label", count: 99, content: <p>Panel 2</p> },
    { value: "pc3", label: "Label", count: 99, content: <p>Panel 3</p> },
    { value: "pc4", label: "Label", count: 99, content: <p>Panel 4</p> },
  ];

  // 4. Square – basic underline
  const squareBasic = [
    { value: "sb1", label: "Label", content: <p>Square 1</p> },
    { value: "sb2", label: "Label", content: <p>Square 2</p> },
    { value: "sb3", label: "Label", content: <p>Square 3</p> },
    { value: "sb4", label: "Label", content: <p>Square 4</p> },
    { value: "sb5", label: "Label", content: <p>Square 5</p> },
  ];

  // 5. Square – icons + counts
  const squareFull = [
    {
      value: "sf1",
      label: "Label",
      icon: Bell,
      count: 99,
      content: <p>Square 1</p>,
    },
    {
      value: "sf2",
      label: "Label",
      icon: Settings,
      count: 99,
      content: <p>Square 2</p>,
    },
    {
      value: "sf3",
      label: "Label",
      icon: Bell,
      count: 99,
      content: <p>Square 3</p>,
    },
    {
      value: "sf4",
      label: "Label",
      icon: Settings,
      count: 99,
      content: <p>Square 4</p>,
    },
  ];

  // State for active tab example
  const [isActive, setIsActive] = useState(true);
  const [activeValue, setActiveValue] = useState("pa2");

  // 6. Active state example
  const pillActive = [
    { value: "pa1", label: "Tab 1", content: <p>Content 1</p> },
    { value: "pa2", label: "Tab 2", content: <p>Content 2</p> },
    { value: "pa3", label: "Tab 3", content: <p>Content 3</p> },
  ];

  // 7. Default active key example
  const defaultKeyExample = [
    {
      value: "dk1",
      label: "First Tab",
      content: <p>This is the first tab content</p>,
    },
    {
      value: "dk2",
      label: "Second Tab",
      content: <p>This is the second tab content</p>,
    },
    {
      value: "dk3",
      label: "Third Tab",
      content: <p>This is the third tab content (default active)</p>,
    },
    {
      value: "dk4",
      label: "Fourth Tab",
      content: <p>This is the fourth tab content</p>,
    },
  ];

  return (
    <>
      {/* Intro */}
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Tab Bar</h2>
        <i className="text-gray-400 text-lg">
          A horizontal or vertical collection of tab items, providing a
          navigation structure that allows users to switch between multiple
          sections or views within the same context.
        </i>
      </div>

      <div className="space-y-6">
        <ComponentExample
          title="Pill – Basic"
          description="Rounded (pill) tabs without icons or counters."
          code={`import Tabs from "@/components/fields/Tabs";

<Tabs
  style="pill"
  tabs={[
    { value: "pb1", label: "Label", content: <p>Panel 1</p> },
    { value: "pb2", label: "Label", content: <p>Panel 2</p> },
    { value: "pb3", label: "Label", content: <p>Panel 3</p> },
    { value: "pb4", label: "Label", content: <p>Panel 4</p> },
  ]}
/>`}
        >
          <Tabs style="pill" tabs={pillBasic} />
        </ComponentExample>

        <ComponentExample
          title="Active State Management"
          description="Tabs can maintain their active state when component is inactive/unmounted."
          code={`import { useState } from "react";
import Tabs from "@/components/fields/Tabs";

const [isActive, setIsActive] = useState(true);
const [activeValue, setActiveValue] = useState("pa2");

<div className="space-y-4">
  <button onClick={() => setIsActive(!isActive)}>
    Toggle Active State
  </button>
  <Tabs
    style="pill"
    active={isActive}
    value={activeValue}
    onValueChange={setActiveValue}
    tabs={[
      { value: "pa1", label: "Tab 1", content: <p>Content 1</p> },
      { value: "pa2", label: "Tab 2", content: <p>Content 2</p> },
      { value: "pa3", label: "Tab 3", content: <p>Content 3</p> },
    ]}
  />
</div>`}
        >
          <div className="space-y-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-4 py-2 bg-primary-normal text-white rounded hover:bg-primary-dark"
            >
              {isActive ? "Deactivate Tabs" : "Activate Tabs"}
            </button>
            <Tabs
              style="pill"
              active={isActive}
              value={activeValue}
              onValueChange={setActiveValue}
              tabs={pillActive}
            />
          </div>
        </ComponentExample>

        <ComponentExample
          title="Default Active Tab"
          description="Set which tab should be active by default using defaultActiveKey (index-based)."
          code={`<Tabs
  style="pill"
  defaultActiveKey={2} // Third tab (index 2) will be active by default
  tabs={[
    { value: "dk1", label: "First Tab", content: <p>First content</p> },
    { value: "dk2", label: "Second Tab", content: <p>Second content</p> },
    { value: "dk3", label: "Third Tab", content: <p>Third content (default)</p> },
    { value: "dk4", label: "Fourth Tab", content: <p>Fourth content</p> },
  ]}
/>`}
        >
          <Tabs style="pill" defaultActiveKey={2} tabs={defaultKeyExample} />
        </ComponentExample>

        <ComponentExample
          title="Pill – With Icons"
          description="Tabs that include a leading icon."
          code={`<Tabs
  style="pill"
  tabs={[
    { value: "pi1", label: "Label", icon: Settings, content: <p>...</p> },
    ...
  ]}
/>`}
        >
          <Tabs style="pill" tabs={pillIcons} />
        </ComponentExample>

        <ComponentExample
          title="Pill – With Counts"
          description="Tabs that show unread/notification counts."
          code={`<Tabs
  style="pill"
  tabs={[
    { value: "pc1", label: "Label", count: 99, content: <p>...</p> },
    ...
  ]}
/>`}
        >
          <Tabs style="pill" tabs={pillCounts} />
        </ComponentExample>

        <ComponentExample
          title="Square – Basic"
          description="Underline indicator only."
          code={`<Tabs
  style="sticky"
  tabs={[
    { value: "sb1", label: "Label", content: <p>...</p> },
    ...
  ]}
/>`}
        >
          <Tabs style="sticky" tabs={squareBasic} defaultActiveKey={2} />
        </ComponentExample>

        <ComponentExample
          title="Square – Icons + Counts"
          description="Underline variant with icons and counters."
          code={`<Tabs
  style="sticky"
  tabs={[
    { value: "sf1", label: "Label", icon: Bell, count: 99, content: <p>...</p> },
    ...
  ]}
/>`}
        >
          <Tabs style="sticky" tabs={squareFull} />
        </ComponentExample>

        <div className="mt-10">
          <h3 className="mb-4 text-xl font-semibold">Tabs Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[
                  [
                    "tabs",
                    "TabItem[]",
                    "—",
                    "Array of tab configuration objects",
                  ],
                  [
                    "style",
                    `"pill" | "sticky"`,
                    `"pill"`,
                    "Visual style (pill / underline)",
                  ],
                  [
                    "orientation",
                    `"horizontal" | "vertical"`,
                    `"horizontal"`,
                    "Layout direction",
                  ],
                  [
                    "sticky",
                    `"none" | "top" | "bottom"`,
                    `"none"`,
                    "Square behaviour (underline variant)",
                  ],
                  ["value", "string", "—", "Controlled active tab value"],
                  [
                    "onValueChange",
                    "(value) ⇒ void",
                    "—",
                    "Controlled-mode callback",
                  ],
                  [
                    "active",
                    "boolean",
                    "true",
                    "Whether the tabs component is active",
                  ],
                  [
                    "defaultActiveKey",
                    "number",
                    "0",
                    "Index of the tab that should be active by default",
                  ],
                  [
                    "tabs[].icon",
                    "Icon component",
                    "—",
                    "Icon displayed before the label",
                  ],
                  ["tabs[].count", "number", "—", "Numeric counter chip"],
                  ["tabs[].badge", "string", "—", "Badge text"],
                  [
                    "tabs[].content",
                    "ReactNode",
                    "—",
                    "Content rendered inside panel",
                  ],
                  [
                    "tabs[].noIndicator",
                    "boolean",
                    "false",
                    "Skip red indicator (Square variant)",
                  ],
                  [
                    "tabs[].disabled",
                    "boolean",
                    "false",
                    "Disable interaction",
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {prop}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{type}</td>
                    <td className="px-6 py-4 text-gray-500">{def}</td>
                    <td className="px-6 py-4 text-gray-500">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabsExample;
