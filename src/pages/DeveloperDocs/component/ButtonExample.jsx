import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Button } from "@/components/Dexain";
import { PlusCircle, Settings, Loader2 } from "lucide-react";

/**
 * Button component documentation and examples
 */
const ButtonExample = () => {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Button</h2>
        <i className="text-gray-400 text-lg">
          A versatile button component that supports various styles, sizes, and states, with Formik integration.
        </i>
      </div>

      <div className="space-y-4">
        {/* Button Variants */}
        <ComponentExample
          title="Button Variants"
          description="Different visual styles for buttons to fit various UI needs"
          code={`import { Button } from "@/components/Dexain";

<Button variant="filled" color="primary">Primary Filled</Button>
<Button variant="outline" color="primary">Primary Outline</Button>
<Button variant="soft" color="primary">Primary Soft</Button>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="filled" color="primary">Primary Filled</Button>
            <Button variant="outline" color="primary">Primary Outline</Button>
            <Button variant="soft" color="primary">Primary Soft</Button>
          </div>
        </ComponentExample>

        {/* Button Colors */}
        <ComponentExample
          title="Button Colors"
          description="Buttons with different color schemes"
          code={`import { Button } from "@/components/Dexain";

<Button variant="filled" color="primary">Primary</Button>
<Button variant="filled" color="secondary">Secondary</Button>
<Button variant="filled" color="success">Success</Button>
<Button variant="filled" color="info">Info</Button>
<Button variant="filled" color="warning">Warning</Button>
<Button variant="filled" color="danger">Danger</Button>
<Button variant="filled" color="tertiary">Tertiary</Button>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="filled" color="primary">Primary</Button>
            <Button variant="filled" color="secondary">Secondary</Button>
            <Button variant="filled" color="success">Success</Button>
            <Button variant="filled" color="info">Info</Button>
            <Button variant="filled" color="warning">Warning</Button>
            <Button variant="filled" color="danger">Danger</Button>
            <Button variant="filled" color="tertiary">Tertiary</Button>
          </div>
        </ComponentExample>

        {/* Button Sizes */}
        <ComponentExample
          title="Button Sizes"
          description="Buttons in different sizes for various UI requirements"
          code={`import { Button } from "@/components/Dexain";

<Button size="sm">Small Size</Button>
<Button size="md">Medium Size</Button>
<Button size="lg">Large Size</Button>
`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small Size</Button>
            <Button size="md">Medium Size</Button>
            <Button size="lg">Large Size</Button>
          </div>
        </ComponentExample>

        {/* Button with Icons */}
        <ComponentExample
          title="Button with Icons"
          description="Combining buttons with icons for enhanced visual cues"
          code={`import { Button } from "@/components/Dexain";
import { PlusCircle, Settings } from "lucide-react";

<Button icon={<PlusCircle className="h-4 w-4" />} iconPosition="left">
  Add Item
</Button>

<Button variant="outline" icon={<Settings className="h-4 w-4" />} iconPosition="right">
  Settings
</Button>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Button icon={<PlusCircle className="h-4 w-4" />} iconPosition="left">
              Add Item
            </Button>
            <Button variant="outline" icon={<Settings className="h-4 w-4" />} iconPosition="right">
              Settings
            </Button>
          </div>
        </ComponentExample>

        {/* Button States */}
        <ComponentExample
          title="Button States"
          description="Buttons in different states: default, loading, and disabled"
          code={`import { Button } from "@/components/Dexain";
import { Loader2 } from "lucide-react";

<Button className="bg-secondary-normal">Normal State</Button>
<Button disabled>Disabled State</Button>
<Button icon={<Loader2 className="h-4 w-4 animate-spin" />}>Loading</Button>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Button className="bg-secondary-normal">Normal State</Button>
            <Button disabled>Disabled State</Button>
            <Button icon={<Loader2 className="h-4 w-4 animate-spin" />}>Loading</Button>
          </div>
        </ComponentExample>

        {/* Button Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Button Props</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">children</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">required</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Content to display inside the button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">disabled</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the button is disabled</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">type</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"button" | "submit" | "reset"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"button"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The type of button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">variant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"filled" | "outline" | "soft"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"filled"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Visual style of the button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">color</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"primary" | "secondary" | "success" | "info" | "warning" | "danger" | "tertiary"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"primary"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Color scheme of the button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">icon</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Icon element to display in the button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">iconPosition</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"left" | "right" | "none"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"none"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Position of the icon relative to the text</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">size</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"sm" | "md" | "lg"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"md"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Size of the button</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonExample; 