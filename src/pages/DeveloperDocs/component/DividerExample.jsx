import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Divider } from "@/components/fields/Divider";

const DividerExample = () => {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Divider</h2>
        <i className="text-gray-400 text-lg">
          A horizontal line with optional label and alignment, used to separate content.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Divider */}
        <ComponentExample
          title="Basic Divider"
          description="Simple divider without label."
          code={`import { Divider } from "@/components/fields/Divider";

<Divider />
`}
        >
          <Divider />
        </ComponentExample>

        {/* Divider with Label */}
        <ComponentExample
          title="Divider with Label"
          description="Divider with a label in the center."
          code={`<Divider label="Center Label" />`}
        >
          <Divider label="Center Label" />
        </ComponentExample>

        {/* Divider with Label Alignment */}
        <ComponentExample
          title="Divider with Label Alignment"
          description="Divider with label aligned to left, center, or right."
          code={`<Divider label="Left Label" labelAlignment="left" />
<Divider label="Center Label" labelAlignment="center" />
<Divider label="Right Label" labelAlignment="right" />`}
        >
          <Divider label="Left Label" labelAlignment="left" />
          <Divider label="Center Label" labelAlignment="center" />
          <Divider label="Right Label" labelAlignment="right" />
        </ComponentExample>

        {/* Divider with Dash Style */}
        <ComponentExample
          title="Dashed Divider"
          description="Divider with dashed line style."
          code={`<Divider style="dash" label="Dashed" />`}
        >
          <Divider style="dash" label="Dashed" />
        </ComponentExample>

        {/* Divider with Custom Style */}
        <ComponentExample
          title="Custom Divider Style"
          description="Divider with custom color and thickness."
          code={`<Divider label="Custom" dividerStyle={{ borderTopColor: 'red', borderTopWidth: 3 }} />`}
        >
          <Divider label="Custom" dividerStyle={{ borderTopColor: 'red', borderTopWidth: 3 }} />
        </ComponentExample>

        {/* Divider Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Divider Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">label</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Text label to display on the divider</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">labelAlignment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"left" | "center" | "right"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"center"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Position of the label (left, center, right)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">style</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"solid" | "dash"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"solid"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Line style: solid or dashed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes for the label and wrapper</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">dividerStyle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">object (CSSProperties)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">'{}'</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Custom style for the divider line (color, thickness, etc)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DividerExample;
