import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { SuggestionInput } from "@/components/common/SuggestionInput";

// Mock fetch function for suggestions
const mockFetchData = async (query) => {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 300));
  // Return filtered suggestions
  return [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Mango", value: "mango" },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};

const SuggestionInputExample = () => {
  const [selected, setSelected] = useState("");
  const [advancedValue, setAdvancedValue] = useState("");

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Suggestion Input</h2>
        <i className="text-gray-400 text-lg">
          An input component with async suggestions dropdown, supporting debounce, custom rendering, and integration with React Hook Form.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Example */}
        <ComponentExample
          title="Basic Suggestion Input"
          description="A simple SuggestionInput with async suggestions and selection."
          code={`import { SuggestionInput } from "@/components/common/SuggestionInput";

<SuggestionInput
  fetchData={mockFetchData}
  placeholder="Type a fruit..."
  onSelect={(val) => setSelected(val)}
/>
`}
        >
          <div className="max-w-xs">
            <SuggestionInput
              fetchData={mockFetchData}
              placeholder="Type a fruit..."
              onSelect={setSelected}
            />
            <div className="mt-2 text-sm text-gray-500">
              Selected: <b>{selected}</b>
            </div>
          </div>
        </ComponentExample>

        {/* Advanced Example */}
        <ComponentExample
          title="Controlled & Debounced Suggestion Input"
          description="Controlled input with custom debounce and value, showing how to use onChange and value props."
          code={`import { SuggestionInput } from "@/components/common/SuggestionInput";

<SuggestionInput
  fetchData={mockFetchData}
  value={advancedValue}
  onChange={setAdvancedValue}
  debounceMs={600}
  placeholder="Controlled input..."
/>
`}
        >
          <div className="max-w-xs">
            <SuggestionInput
              fetchData={mockFetchData}
              value={advancedValue}
              onChange={setAdvancedValue}
              debounceMs={600}
              placeholder="Controlled input..."
            />
            <div className="mt-2 text-sm text-gray-500">
              Value: <b>{advancedValue}</b>
            </div>
          </div>
        </ComponentExample>

        <ComponentExample
          title="Suggestion Input with JSON Value"
          description="Example where each suggestion is an object, and the selected value is a JSON object."
          code={`import { SuggestionInput } from "@/components/common/SuggestionInput";

const jsonSuggestions = [
  { label: "Apple", value: { id: 1, name: "Apple", type: "fruit" } },
  { label: "Banana", value: { id: 2, name: "Banana", type: "fruit" } },
  { label: "Carrot", value: { id: 3, name: "Carrot", type: "vegetable" } },
];

const fetchJsonSuggestions = async (query) => {
  if (!query) return [];
  return jsonSuggestions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
};

const [jsonSelected, setJsonSelected] = useState(null);

<SuggestionInput
  fetchData={fetchJsonSuggestions}
  placeholder="Type a fruit or vegetable..."
  onSelect={setJsonSelected}
/>
<div>
  Selected: <pre>{JSON.stringify(jsonSelected, null, 2)}</pre>
</div>
`}
        >
          {(() => {
            const jsonSuggestions = [
              { label: "Apple", value: { id: 1, name: "Apple", type: "fruit" } },
              { label: "Banana", value: { id: 2, name: "Banana", type: "fruit" } },
              { label: "Carrot", value: { id: 3, name: "Carrot", type: "vegetable" } },
            ];
            const fetchJsonSuggestions = async (query) => {
              if (!query) return [];
              return jsonSuggestions.filter((item) =>
                item.label.toLowerCase().includes(query.toLowerCase())
              );
            };
            const [jsonSelected, setJsonSelected] = React.useState(null);
            return (
              <div className="max-w-xs">
                <SuggestionInput
                  fetchData={fetchJsonSuggestions}
                  placeholder="Type a fruit or vegetable..."
                  onSelect={setJsonSelected}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Selected:{" "}
                  <pre className="bg-gray-100 rounded p-2 text-xs">
                    {jsonSelected
                      ? JSON.stringify(jsonSelected, null, 2)
                      : "<none>"}
                  </pre>
                </div>
              </div>
            );
          })()}
        </ComponentExample>

        {/* Props Table */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">SuggestionInput Props</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">fetchData</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">(query: string) =&gt; Promise&lt;Array&lt;string | </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Function to fetch suggestions based on input query. Must return a Promise of array of suggestions.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onSelect</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">(value: string) =&gt; void</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback when a suggestion is selected. Receives the value of the selected suggestion.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">debounceMs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Debounce delay in milliseconds for fetching suggestions.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes for the input element.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Name for React Hook Form integration.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onChange</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">(value: string) =&gt; void</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback when the input value changes.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string | object</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Controlled value for the input.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">placeholder</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Placeholder text for the input.</td>
                </tr>
                {/* Add more props as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuggestionInputExample; 