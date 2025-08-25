import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { Checkbox, STATES, CHECKED_STATES } from "@/components/fields/Checkbox";
import { Form, Button } from "@/components/Dexain";
import { z } from "zod";

const Label = ({ children }) => (
  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </span>
);

const Description = ({ children }) => (
  <span className="text-xs text-gray-500 leading-none mt-1">
    {children}
  </span>
);

const CheckboxExample = () => {
  // Non-form state for demonstration - using boolean values
  const [d1, setD1] = useState(false);
  const [d2, setD2] = useState(true);
  const [d3, setD3] = useState(true);
  const [d4, setD4] = useState("indeterminate");

  // Focus states
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(true);
  const [f3, setF3] = useState(true);
  const [f4, setF4] = useState("indeterminate");

  // Error states
  const [e1, setE1] = useState(false);
  const [e2, setE2] = useState(true);
  const [e3, setE3] = useState(true);
  const [e4, setE4] = useState("indeterminate");

  // Handle state changes for non-form checkboxes
  const handleChange = (setter) => (newValue) => {
    // Convert CHECKED_STATES to boolean for state management
    if (newValue === CHECKED_STATES.checked) {
      setter(true);
    } else if (newValue === CHECKED_STATES.unchecked) {
      setter(false);
    } else {
      setter(newValue); // for indeterminate or boolean values
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Checkbox</h2>
      <p className="text-gray-600 mb-6">
        A checkbox component that allows users to select one or multiple options. Supports various states including checked, unchecked, indeterminate, focus, error, and disabled states. Now integrated with React Hook Form and Zod validation.
      </p>

      {/* Form Integration Example */}
      <ComponentExample
        title="Form Integration with React Hook Form & Zod"
        description="Checkbox integrated with React Hook Form and Zod validation"
        code={`import { Form, Button, Checkbox } from "@/components/Dexain";
import { z } from "zod";

<Form
  validation={z.object({
    terms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions"
    }),
    newsletter: z.boolean().optional(),
    notifications: z.boolean().optional(),
  })}
  defaultValues={{
    terms: false,
    newsletter: false,
    notifications: false,
  }}
  onSubmit={(values) => {
    console.log(values);
  }}
>
  <Checkbox 
    name="terms" 
    label="Accept terms and conditions"
    required
  />
  <Checkbox 
    name="newsletter" 
    label="Subscribe to newsletter"
    description="Get updates about our product"
  />
  <Checkbox 
    name="notifications" 
    label="Enable notifications"
    info="Receive push notifications"
  />
  <Button type="submit">Submit</Button>
</Form>`}
      >
        <Form
          validation={z.object({
            terms: z.boolean().refine(val => val === true, {
              message: "You must accept the terms and conditions"
            }),
            newsletter: z.boolean().optional(),
            notifications: z.boolean().optional(),
          })}
          defaultValues={{
            terms: false,
            newsletter: false,
            notifications: false,
          }}
          onSubmit={(values) => {
            console.log("Form submitted:", values);
          }}
        >
          <Checkbox 
            name="terms" 
            label="Accept terms and conditions"
            required
          />
          <Checkbox 
            name="newsletter" 
            label="Subscribe to newsletter"
            description="Get updates about our product"
          />
          <Checkbox 
            name="notifications" 
            label="Enable notifications"
            info="Receive push notifications"
          />
          <Button type="submit">Submit</Button>
        </Form>
      </ComponentExample>

      {/* Basic Checkbox */}
      <ComponentExample
        title="Basic Checkbox"
        description="Standard checkbox with different states and labels"
        code={`import { Checkbox, CHECKED_STATES } from "@/components/fields/Checkbox";

// Simple checkbox
<Checkbox 
  value={false} 
  onChange={(value) => console.log(value)} 
/>

// Checkbox with label
<Checkbox 
  value={true}
  onChange={(value) => console.log(value)}
  label="Accept terms"
/>

// Checkbox with label and description
<Checkbox
  value={true}
  onChange={(value) => console.log(value)}
  label="Newsletter"
  description="Get updates about our product"
/>`}
      >
        <div className="flex flex-col gap-4">
          <Checkbox 
            value={d1} 
            onChange={handleChange(setD1)} 
          />
          <Checkbox 
            value={d2} 
            onChange={handleChange(setD2)} 
            label="Accept terms"
          />
          <Checkbox
            value={d3}
            onChange={handleChange(setD3)}
            label="Newsletter"
            description="Get updates about our product"
          />
        </div>
      </ComponentExample>

      {/* States and Variants */}
      <ComponentExample
        title="States and Variants"
        description="Checkbox supports multiple states including focus, error, and disabled variants"
        code={`import { Checkbox, STATES, CHECKED_STATES } from "@/components/fields/Checkbox";

// Focus state
<Checkbox
  value={true}
  state={STATES.focus}
  label="Focus state"
/>

// Error state
<Checkbox
  value={true}
  state={STATES.error}
  label="Error state"
/>

// Disabled state
<Checkbox
  value={true}
  state={STATES.disable}
  label="Disabled state"
/>`}
      >
        <div className="flex flex-col gap-4">
          <Checkbox
            value={f2}
            onChange={handleChange(setF2)}
            label="Focus state"
            state={STATES.focus}
          />
          <Checkbox 
            value={e2} 
            onChange={handleChange(setE2)} 
            label="Error state"
            state={STATES.error}
          />
          <Checkbox 
            value={true}
            label="Disabled state"
            state={STATES.disable}
          />
        </div>
      </ComponentExample>

      {/* Indeterminate State */}
      <ComponentExample
        title="Indeterminate State"
        description="Checkbox with indeterminate state, useful for parent-child checkbox relationships"
        code={`import { Checkbox, CHECKED_STATES } from "@/components/fields/Checkbox";

<Checkbox
  value="indeterminate"
  onChange={(value) => console.log(value)}
  label="Parent option"
/>`}
      >
        <div className="flex flex-col gap-4">
          <Checkbox
            value={d4}
            onChange={handleChange(setD4)}
            label="Parent option"
          />
        </div>
      </ComponentExample>

      {/* All Variations Demo */}
      <ComponentExample
        title="All States × Label Variations"
        description="Comprehensive demo showing all possible states and variants"
        code={`// See source for full implementation`}
      >
        <div className="grid grid-cols-5 gap-x-6 gap-y-6 items-start">
          {/* header */}
          <div></div>
          <div className="font-medium">No label</div>
          <div className="font-medium">Label</div>
          <div className="font-medium">Label + description</div>
          <div className="font-medium">Indeterminate</div>

          {/* Default (interactive) */}
          <div className="font-semibold">Default</div>
          <Checkbox 
            value={d1} 
            onChange={handleChange(setD1)} 
          />
          <Checkbox 
            value={d2} 
            onChange={handleChange(setD2)} 
            label="Label"
          />
          <Checkbox
            value={d3}
            onChange={handleChange(setD3)}
            label="Label"
            description="Additional info"
          />
          <Checkbox
            value={d4}
            onChange={handleChange(setD4)}
            label="Indeterminate"
            description="Additional info"
          />

          {/* Focus (interactive) */}
          <div className="font-semibold">Focus</div>
          <Checkbox
            value={f1}
            onChange={handleChange(setF1)}
            state={STATES.focus}
          />
          <Checkbox
            value={f2}
            onChange={handleChange(setF2)}
            label="Label"
            state={STATES.focus}
          />
          <Checkbox
            value={f3}
            onChange={handleChange(setF3)}
            label="Label"
            description="Additional info"
            state={STATES.focus}
          />
          <Checkbox
            value={f4}
            onChange={handleChange(setF4)}
            label="Indeterminate"
            description="Additional info"
            state={STATES.focus}
          />

          {/* Error (interactive) */}
          <div className="font-semibold">Error</div>
          <Checkbox 
            value={e1} 
            onChange={handleChange(setE1)} 
            state={STATES.error}
          />
          <Checkbox 
            value={e2} 
            onChange={handleChange(setE2)} 
            label="Label"
            state={STATES.error}
          />
          <Checkbox
            value={e3}
            onChange={handleChange(setE3)}
            label="Label"
            description="Additional info"
            state={STATES.error}
          />
          <Checkbox
            value={e4}
            onChange={handleChange(setE4)}
            label="Indeterminate"
            description="Additional info"
            state={STATES.error}
          />

          {/* Disabled (non-interactive) */}
          <div className="font-semibold">Disabled</div>
          <Checkbox 
            value={false}
            state={STATES.disable}
          />
          <Checkbox 
            value={true}
            label="Label"
            state={STATES.disable}
          />
          <Checkbox
            value={true}
            label="Label"
            description="Additional info"
            state={STATES.disable}
          />
          <Checkbox
            value="indeterminate"
            label="Indeterminate"
            description="Additional info"
            state={STATES.disable}
          />
        </div>
      </ComponentExample>

      {/* Props Reference */}
      <div className="mt-12 border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Props Reference</h3>
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
              <td className="p-2 border"><code>name</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">undefined</td>
              <td className="p-2 border">Field name for React Hook Form integration</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>checked</code></td>
              <td className="p-2 border">CHECKED_STATES | boolean</td>
              <td className="p-2 border">CHECKED_STATES.unchecked</td>
              <td className="p-2 border">The checked state of the checkbox (for backward compatibility)</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>value</code></td>
              <td className="p-2 border">boolean | string</td>
              <td className="p-2 border">undefined</td>
              <td className="p-2 border">Preferred prop for controlled components (boolean or "indeterminate")</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>onChange</code></td>
              <td className="p-2 border">function</td>
              <td className="p-2 border">undefined</td>
              <td className="p-2 border">Callback fired when the checkbox state changes</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>state</code></td>
              <td className="p-2 border">STATES</td>
              <td className="p-2 border">STATES.default</td>
              <td className="p-2 border">Visual state of the checkbox (default, focus, error, disable)</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>label</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">undefined</td>
              <td className="p-2 border">Label text to display next to the checkbox</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>description</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">""</td>
              <td className="p-2 border">Additional description text below the label</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>required</code></td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Show required asterisk (*) next to label</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>disabled</code></td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Disable the checkbox</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>info</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">""</td>
              <td className="p-2 border">Info tooltip text displayed on hover</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>className</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">""</td>
              <td className="p-2 border">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>

        <h4 className="text-md font-medium mt-6 mb-2">Constants</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-1">STATES</h5>
            <pre className="bg-gray-100 p-2 rounded">
{`{
  default: "default",
  focus: "focus",
  error: "error",
  disable: "disable"
}`}
            </pre>
          </div>
          <div>
            <h5 className="font-medium mb-1">CHECKED_STATES</h5>
            <pre className="bg-gray-100 p-2 rounded">
{`{
  checked: "checked",
  unchecked: "unchecked",
  indeterminated: "indeterminated"
}`}
            </pre>
          </div>
        </div>

        <h4 className="text-md font-medium mt-6 mb-2">Features</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>React Hook Form Integration:</strong> Automatically integrates with React Hook Form when name prop is provided</li>
          <li><strong>Zod Validation:</strong> Works seamlessly with Zod schema validation</li>
          <li><strong>Multiple States:</strong> Supports default, focus, error, and disabled states</li>
          <li><strong>Indeterminate Support:</strong> Built-in support for indeterminate state</li>
          <li><strong>Validation:</strong> Shows error state and messages when used with form validation</li>
          <li><strong>Accessibility:</strong> Proper ARIA attributes and keyboard navigation</li>
          <li><strong>Customizable:</strong> Flexible styling with custom states and themes</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckboxExample;
