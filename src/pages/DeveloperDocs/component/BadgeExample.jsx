import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Badge } from "@/components/fields/Badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Badge component documentation and examples
 */
const BadgeExample = () => {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Badge</h2>
        <i className="text-gray-400 text-lg">
          A versatile badge component that supports various styles, colors, and
          sizes for displaying status, labels, or counts.
        </i>
      </div>

      <div className="space-y-4">
        {/* Badge Variants */}
        <ComponentExample
          title="Badge Variants"
          description="Different visual styles for badges"
          code={`import Badge from "@/components/fields/Badge";

<Badge variant="filled">Filled Badge</Badge>
<Badge variant="outline">Outline Badge</Badge>
<Badge variant="soft">Soft Badge</Badge>
<Badge variant="label">Label Badge</Badge>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Badge variant="filled">Filled Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Badge variant="soft">Soft Badge</Badge>
            <Badge variant="label">Label Badge</Badge>
          </div>
        </ComponentExample>

        {/* Badge Colors */}
        <ComponentExample
          title="Badge Colors"
          description="Badges with different color schemes"
          code={`import Badge from "@/components/fields/Badge";

<Badge color="primary">Primary</Badge>
<Badge color="secondary">Secondary</Badge>
<Badge color="success">Success</Badge>
<Badge color="info">Info</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="danger">Danger</Badge>
<Badge color="disable">Disabled</Badge>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Badge color="primary">Primary</Badge>
            <Badge color="secondary">Secondary</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="info">Info</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="danger">Danger</Badge>
            <Badge color="disable">Disabled</Badge>
          </div>
        </ComponentExample>

        {/* Badge Sizes */}
        <ComponentExample
          title="Badge Sizes"
          description="Badges in different sizes"
          code={`import Badge from "@/components/fields/Badge";

<Badge size="sm">Small Badge</Badge>
<Badge size="md">Medium Badge</Badge>
`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm">Small Badge</Badge>
            <Badge size="md">Medium Badge</Badge>
          </div>
        </ComponentExample>

        {/* Badge with Icons */}
        <ComponentExample
          title="Badge with Custom Class Name"
          description="Badges with custom className"
          code={`import Badge from "@/components/fields/Badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

<Badge color="success" variant="soft" className="bg-green-500">
  <CheckCircle className="h-4 w-4 mr-1" />
  Completed
</Badge>

<Badge color="warning" variant="soft" className="bg-yellow-500">
  <AlertCircle className="h-4 w-4 mr-1" />
  Pending
</Badge>

<Badge color="info" variant="soft" className="bg-blue-500">
  <Info className="h-4 w-4 mr-1" />
  Information
</Badge>
`}
        >
          <div className="flex flex-wrap gap-4">
            <Badge
              color="success"
              variant="soft"
              className="bg-white border-green-500"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </Badge>
            <Badge
              color="warning"
              variant="soft"
              className="bg-white border-yellow-500"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Pending
            </Badge>
            <Badge
              color="info"
              variant="soft"
              className="bg-white border-blue-500"
            >
              <Info className="h-4 w-4 mr-1" />
              Information
            </Badge>
          </div>
        </ComponentExample>

        {/* Badge Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Badge Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    children
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ReactNode
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    required
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Content to display inside the badge
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    color
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "primary" | "secondary" | "success" | "info" | "warning" |
                    "danger" | "disable"
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "primary"
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Color scheme of the badge
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    variant
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "filled" | "outline" | "soft" | "label"
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "filled"
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Visual style of the badge
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    size
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "sm" | "md"
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "md"
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Size of the badge
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    className
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ""
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Additional CSS classes to apply to the badge
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeExample;
