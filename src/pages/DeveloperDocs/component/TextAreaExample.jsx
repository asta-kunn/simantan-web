import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { TextArea, Form, Button } from "@/components/Dexain";
import * as z from "zod";

/**
 * TextArea component documentation and examples
 */
const TextAreaExample = () => {
  const [value, setValue] = useState("");

  // Example validation schema
  const validationSchema = z.object({
    feedback: z.string().min(10, "Feedback must be at least 10 characters")
  });

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">TextArea</h2>
        <i className="text-gray-400 text-lg">
          A multi-line text input component that can be used standalone or integrated with React Hook Form.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic TextArea */}
        <ComponentExample
          title="Basic TextArea"
          description="Standard text area with label"
          code={`import { TextArea } from "@/components/Dexain";

<TextArea 
  label="Feedback" 
  placeholder="Enter your feedback..." 
  rows={4}
/>
`}
        >
          <TextArea 
            label="Feedback" 
            placeholder="Enter your feedback..." 
            rows={4}
          />
        </ComponentExample>

        {/* Required TextArea */}
        <ComponentExample
          title="Required TextArea"
          description="TextArea with required indicator"
          code={`import { TextArea } from "@/components/Dexain";

<TextArea 
  label="Comments" 
  placeholder="Enter your comments..." 
  required 
  rows={3}
/>
`}
        >
          <TextArea 
            label="Comments" 
            placeholder="Enter your comments..." 
            required 
            rows={3}
          />
        </ComponentExample>

        {/* Disabled TextArea */}
        <ComponentExample
          title="Disabled TextArea"
          description="TextArea in disabled state"
          code={`import { TextArea } from "@/components/Dexain";

<TextArea 
  label="Readonly Content" 
  placeholder="This content cannot be edited" 
  disabled 
  value="This text area is disabled and cannot be edited by the user."
/>
`}
        >
          <TextArea 
            label="Readonly Content" 
            placeholder="This content cannot be edited" 
            disabled 
            value="This text area is disabled and cannot be edited by the user."
          />
        </ComponentExample>

        {/* Controlled TextArea */}
        <ComponentExample
          title="Controlled TextArea"
          description="TextArea with React state management"
          code={`import React, { useState } from "react";
import { TextArea, Button } from "@/components/Dexain";

const MyComponent = () => {
  const [value, setValue] = useState("");
  
  return (
    <>
      <TextArea 
        label="Controlled Input" 
        placeholder="Type something..." 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="mt-2">
        Character count: {value.length}
      </p>
      <Button 
        onClick={() => setValue("")}
        className="mt-2"
        variant="outline"
      >
        Clear
      </Button>
    </>
  );
};
`}
        >
          <>
            <TextArea 
              label="Controlled Input" 
              placeholder="Type something..." 
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="mt-2">
              Character count: {value.length}
            </p>
            <Button 
              onClick={() => setValue("")}
              className="mt-2"
              variant="outline"
            >
              Clear
            </Button>
          </>
        </ComponentExample>

        {/* Form Integration */}
        <ComponentExample
          title="Form Integration"
          description="TextArea integrated with React Hook Form and validation"
          code={`import { Form, TextArea, Button } from "@/components/Dexain";
import * as z from "zod";

// Define validation schema
const validationSchema = z.object({
  feedback: z.string().min(10, "Feedback must be at least 10 characters")
});

<Form
  validation={validationSchema}
  defaultValues={{ feedback: "" }}
  onSubmit={(values) => {
    console.log("Form submitted with:", values);
    alert(JSON.stringify(values, null, 2));
  }}
>
  <TextArea
    name="feedback"
    label="Your Feedback"
    placeholder="Please provide your feedback (min 10 characters)..."
    required
    rows={4}
  />
  
  <Button type="submit" className="mt-4">
    Submit Feedback
  </Button>
</Form>
`}
        >
          <Form
            validation={validationSchema}
            defaultValues={{ feedback: "" }}
            onSubmit={(values) => {
              console.log("Form submitted with:", values);
              alert(JSON.stringify(values, null, 2));
            }}
          >
            <TextArea
              name="feedback"
              label="Your Feedback"
              placeholder="Please provide your feedback (min 10 characters)..."
              required
              rows={4}
            />
            
            <Button type="submit" className="mt-4">
              Submit Feedback
            </Button>
          </Form>
        </ComponentExample>

        {/* Custom Styling */}
        <ComponentExample
          title="Custom Styling"
          description="TextArea with custom styling"
          code={`import { TextArea } from "@/components/Dexain";

<TextArea 
  label="Notes" 
  placeholder="Enter your notes..." 
  className="font-mono"
  rows={3}
/>
`}
        >
          <TextArea 
            label="Notes" 
            placeholder="Enter your notes..." 
            className="font-mono"
            rows={3}
          />
        </ComponentExample>

        {/* TextArea Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">TextArea Props</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Field name (required for React Hook Form integration)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">label</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Label text displayed above the textarea</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">placeholder</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Enter text..."</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Placeholder text for the textarea</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">disabled</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the textarea is disabled</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the textarea</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">required</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the textarea is required</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">rows</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Number of rows to display</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Value for controlled component usage</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onChange</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Event handler for value changes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextAreaExample; 