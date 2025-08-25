import React from 'react';
import { ComponentExample } from "./ComponentExample";
import { Accordion } from "@/components/fields/Accordion";
import { Button } from "@/components/Dexain";
import { Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/fields/Badge";

/**
 * Accordion component documentation and examples
 */
const AccordionExample = () => {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Accordion</h2>
        <i className="text-gray-400 text-lg">
          A collapsible content component that can be expanded and collapsed to show or hide content.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Accordion */}
        <ComponentExample
          title="Basic Accordion"
          description="Simple accordion with title and content"
          code={`import Accordion from "@/components/fields/Accordion";

<Accordion
  title="Basic Accordion"
  defaultOpen={true}
  className="text-primary-normal"
>
  <p>This is the accordion content. You can put any content here.</p>
</Accordion>
`}
        >
          <Accordion
            title="Basic Accordion"
            defaultOpen={true}
            className="text-primary-normal"
          >
            <p>This is the accordion content. You can put any content here.</p>
          </Accordion>
        </ComponentExample>

        {/* Accordion with Icon */}
        <ComponentExample
          title="Accordion with Icon"
          description="Accordion with a custom icon"
          code={`import Accordion from "@/components/fields/Accordion";
import { Info } from "lucide-react";

<Accordion
  title="Accordion with Icon"
  icon={<Info className="h-5 w-5 text-blue-500" />}
>
  <p>This accordion includes an icon in the header.</p>
</Accordion>
`}
        >
          <Accordion
            title="Accordion with Icon"
            icon={<Info className="h-5 w-5 text-blue-500" />}
          >
            <p>This accordion includes an icon in the header.</p>
          </Accordion>
        </ComponentExample>

        {/* Accordion with Right Items */}
        <ComponentExample
          title="Accordion with Right Items"
          description="Accordion with multiple items on the right side"
          code={`import Accordion from "@/components/fields/Accordion";
import { AlertCircle } from "lucide-react";

<Accordion
  title="Accordion with Right Items"
  rightHeaderItems={[
    <Badge color="success" variant="soft">Active</Badge>,
    <AlertCircle key="icon" className="h-5 w-5 text-yellow-500" />
  ]}
  separator={true}
>
  <p>This accordion includes multiple items on the right side of the header.</p>
</Accordion>
`}
        >
          <Accordion
            title="Accordion with Right Items"
            rightHeaderItems={[
              <Badge color="success" variant="soft">Active</Badge>,
              <AlertCircle key="icon" className="h-5 w-5 text-yellow-500" />
            ]}
            separator={true}
          >
            <p>This accordion includes multiple items on the right side of the header.</p>
          </Accordion>
        </ComponentExample>

        {/* Accordion Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Accordion Props</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string | ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The title displayed in the accordion header</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">icon</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">null</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Icon element to display before the title</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">rightHeaderItems</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode[]</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Array of elements to display on the right side of the header</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">defaultOpen</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the accordion should be open by default</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">separator</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether to show a separator line before the chevron</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the accordion</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">children</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The content to be displayed in the accordion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccordionExample;