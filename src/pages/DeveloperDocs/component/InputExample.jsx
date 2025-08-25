import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { Input, Form, Button } from "@/components/Dexain";
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

/**
 * Input component documentation and examples
 */
const InputExample = () => {
  const [submittedValues, setSubmittedValues] = useState(null);

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Input</h2>
        <i className="text-gray-400 text-lg">
          A versatile input component that supports various types, states, and customizations. Features include form integration with react-hook-form, password visibility toggle, prefix/suffix support, and animated error messages.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Input */}
        <ComponentExample
          title="Basic Input"
          description="Standard text input with label and required state"
          code={`import { Input } from "@/components/Dexain";

<Input 
  label="Email" 
  placeholder="Enter your email" 
  required
  info="We'll never share your email"
/>
`}
        >
          <Input 
            label="Email" 
            placeholder="Enter your email" 
            required
            info="We'll never share your email"
          />
        </ComponentExample>

        {/* Input with Prefix/Suffix */}
        <ComponentExample
          title="Input with Prefix/Suffix"
          description="Input with icon prefix and custom suffix elements. Supports both string and React element prefixes/suffixes."
          code={`import { Input } from "@/components/Dexain";
import { Search, Mail } from "lucide-react";

// Input with icon prefix
<Input 
  label="Search" 
  placeholder="Search..." 
  prefix={<Search className="h-4 w-4 text-gray-400" />}
/>

// Input with text prefix
<Input 
  label="Email" 
  placeholder="Enter your email" 
  type="email"
  prefix={<Mail className="h-4 w-4 text-gray-400" />}
/>

// Input with text suffix
<Input 
  label="Username" 
  placeholder="username" 
  suffix="@example.com"
/>
`}
        >
          <div className="space-y-4">
            <Input
              label="Search"
              placeholder="Search..."
              prefix={<Search className="h-4 w-4 text-gray-400" />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              prefix={<Mail className="h-4 w-4 text-gray-400" />}
            />

            <Input
              label="Username"
              placeholder="username"
              suffix="@example.com"
            />
          </div>
        </ComponentExample>

        {/* Password Input */}
        <ComponentExample
          title="Password Input"
          description="Input with toggleable eye icon to show/hide password. Automatically handles password visibility state."
          code={`import { Input } from "@/components/Dexain";

<Input 
  label="Password" 
  placeholder="Enter your password" 
  type="password"
/>
`}
        >
          <div className="space-y-4">
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
        </ComponentExample>

        {/* Input States */}
        <ComponentExample
          title="Input States"
          description="Various input states including default, disabled, error, and with caption. Features animated error messages."
          code={`import { Input } from "@/components/Dexain";

// Default state
<Input 
  label="Default" 
  placeholder="Default input" 
/>

// Disabled state
<Input 
  label="Disabled" 
  placeholder="This input is disabled" 
  disabled
/>

// With caption
<Input 
  label="With Caption" 
  placeholder="Enter text" 
  caption="This is a helpful caption"
/>

// With error (when used in Form)
<Input 
  name="errorField"
  label="With Error" 
  placeholder="This will show error"
/>
`}
        >
          <div className="space-y-4">
            <Input label="Default" placeholder="Default input" />

            <Input
              label="Disabled"
              placeholder="This input is disabled"
              disabled
            />

            <Input
              label="With Caption"
              placeholder="Enter text"
              caption="This is a helpful caption"
            />
          </div>
        </ComponentExample>

        {/* Form Integration */}
        <ComponentExample
          title="Form Integration"
          description="Using Input within a Form component with react-hook-form and Zod validation. Features automatic error handling and animated error messages."
          code={`import { Form, Input, Button } from "@/components/Dexain";
import { z } from "zod";

<Form
  defaultValues={{
    email: "",
    password: "",
  }}
  validation={z.object({
    email: z.string()
      .nonempty("Email is required!")
      .email("Invalid email address"),
    password: z.string()
      .nonempty("Password is required!")
      .min(8, "Password must be at least 8 characters"),
  })}
  onSubmit={(values) => {
    console.log("Form submitted with:", values);
  }}
>
  <Input
    name="email"
    label="Email"
    placeholder="Enter your email"
    required
  />
  
  <Input
    name="password"
    label="Password"
    type="password"
    placeholder="Enter your password"
    required
  />

  <Button type="submit" className="mt-4">
    Submit
  </Button>
</Form>
`}
        >
          <Form
            defaultValues={{
              email: "",
              password: "",
            }}
            validation={z.object({
              email: z.string()
                .nonempty("Email is required!")
                .email("Invalid email address"),
              password: z.string()
                .nonempty("Password is required!")
                .min(8, "Password must be at least 8 characters"),
            })}
            onSubmit={(values) => {
              console.log("Form submitted with:", values);
              setSubmittedValues(values);
            }}
          >
            <Input
              name="email"
              label="Email"
              placeholder="Enter your email"
              required
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />

            <Button type="submit" className="mt-4">
              Submit
            </Button>

            {submittedValues && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Values:</h4>
                <pre className="text-sm text-gray-600">
                  {JSON.stringify(submittedValues, null, 2)}
                </pre>
              </div>
            )}
          </Form>
        </ComponentExample>

        {/* Input Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Input Props</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Label text displayed above the input</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Field name (required for form integration with react-hook-form)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">type</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"text"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">HTML input type attribute (text, password, email, etc.). For password type, includes toggle visibility feature.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">placeholder</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Placeholder text for the input field</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Current value (for controlled components)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">required</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the input is required (adds red asterisk)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">disabled</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the input is disabled</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onChange</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Event handler for when the input value changes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">prefix</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode | string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Element or text to display before the input. Supports both string and React elements.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">suffix</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode | string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Element or text to display after the input. Supports both string and React elements.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">caption</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Helper text displayed below the input</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">info</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Tooltip text displayed on info icon hover</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the input</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputExample;
