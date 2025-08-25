import { Info } from "@/components/common/Info";
import { Card } from "@/components/Dexain";
import { Link } from "react-router-dom";
import { ComponentExample } from "./ComponentExample";

const InfoExample = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Info</h2>
        <i className="text-gray-400 text-lg">
          A component for displaying labeled information with customizable styling.
        </i>
      </div>

      <div className="space-y-4">
        <ComponentExample
          title="Basic Info"
          description="Simple info component with label and value"
          code={`import Info from "@/components/common/Info";

<Info 
  label="Status" 
  value="Active" 
/>`}
        >
          <Info 
            label="Status" 
            value="Active"
          />
        </ComponentExample>

        <ComponentExample
          title="Custom Styled Info"
          description="Info component with custom styling applied to label and value"
          code={`import Info from "@/components/common/Info";

<Info
  label="Priority"
  value={(
    <span className="cursor-pointer" onClick={() => alert("Clicked Here!")}>
      Create ProofPrint
    </span>
  )}
  valueClassName="text-red-700"
/>`}
        >
          <Info
            label="Priority"
            value={(
              <span className="cursor-pointer" onClick={() => alert("Clicked Here!")}>
                Create ProofPrint
              </span>
            )}
            valueClassName="text-red-700"
          />
        </ComponentExample>

        <ComponentExample
          title="Info in Card Layout"
          description="Multiple info components arranged in a card"
          code={`import { Card } from "@/components/Dexain";
import Info from "@/components/common/Info";

<Card title="Project Details">
  <div className="grid grid-cols-2 gap-4 p-4">
    <Info label="Category" value="Development" />
    <Info label="Status" value="In Progress" />
    <Info 
      containerClassName="col-span-full"
      label="Description"
      value={(
        <span className="cursor-pointer" onClick={() => alert("Your description here!")}>
          Show Detail
        </span>
      )}
    />
  </div>
</Card>`}
        >
          <Card title="Project Details">
            <div className="grid grid-cols-2 gap-4 p-4">
              <Info label="Category" value="Development" />
              <Info label="Status" value="In Progress" />
              <Info 
                containerClassName="col-span-full"
                label="Description"
                value={(
                  <span className="cursor-pointer" onClick={() => alert("Your description here!")}>
                    Show Detail
                  </span>
                )}
              />
            </div>
          </Card>
        </ComponentExample>

        <ComponentExample
          title="Info with Custom Value Component"
          description="Info component with a React component as value"
          code={`import Info from "@/components/common/Info";
import { Link } from "react-router-dom";

<Info
  label="Action"
  value={
    <Link to="/dashboard" className="text-blue-500 hover:underline">
      Go to Dashboard
    </Link>
  }
/>`}
        >
          <Info
            label="Action"
            value={
              <Link to="/dashboard" className="text-blue-500 hover:underline">
                Go to Dashboard
              </Link>
            }
          />
        </ComponentExample>

        <div className="mt-12 border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Props Reference</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Your Label"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The label text displayed above the value</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string | ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Your Value"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The value to display, can be text or a React component</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">labelClassName</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes for the label element</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">valueClassName</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes for the value element</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">containerClassName</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes for the container element</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoExample;
