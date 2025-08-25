import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentExample } from "./ComponentExample";
import {
  Form,
  Input,
  TextArea,
  DatePicker,
  Select,
  Button,
} from "@/components/Dexain";
import { Search } from "lucide-react";
import { z } from "zod";

/**
 * Form component documentation and examples
 */
const FormExample = () => {
  const [option, setOption] = useState();

  // Sample validation schema
  const validationSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    message: z.string().min(1, "Message is required"),
    date: z.date({ required_error: "Date is required" }),
    category: z.string().min(1, "Category is required"),
  });

  const setFieldValueValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
    },
    resolver: zodResolver(setFieldValueValidationSchema),
  });

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Form</h2>
        <i className="text-gray-400 text-lg">
          A comprehensive form component that integrates with React Hook Form
          and Zod for validation and state management.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Form with React Hook Form */}
        <ComponentExample
          title="Form with React Hook Form Integration"
          description="Complete form with validation using React Hook Form and Zod"
          code={`import { Form, Input, TextArea, DatePicker, Select, Button } from "@/components/Dexain";
import { z } from "zod";

const validationSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  message: z.string().min(1, "Message is required"),
  date: z.date({ required_error: "Date is required" }),
  category: z.string().min(1, "Category is required"),
});

<Form
  initialValues={{
    email: "",
    message: "",
    date: null,
    category: "",
  }}
  validation={validationSchema}
  onSubmit={(values) => {
    console.log("Form submitted:", values);
  }}
>
  <Input
    name="email"
    label="Email"
    placeholder="Enter your email"
    required
  />

  <TextArea
    name="message"
    label="Message"
    placeholder="Enter your message"
    required
  />

  <DatePicker
    name="date"
    label="Select Date"
    placeholder="Choose a date"
    required
  />

  <Select
    name="category"
    label="Category"
    placeholder="Select a category"
    options={[
      { value: "support", label: "Support" },
      { value: "feedback", label: "Feedback" },
      { value: "feature", label: "Feature Request" }
    ]}
    required
  />

  <Button
    type="submit"
    className="mt-4"
  >
    Submit
  </Button>
</Form>`}
        >
          <Form
            initialValues={{
              email: "",
              message: "",
              date: null,
              category: "",
            }}
            validation={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
            }}
          >
            <Input
              className="w-full"
              name="email"
              label="Email"
              placeholder="Enter your email"
              required
            />

            <TextArea
              className="w-full"
              name="message"
              label="Message"
              placeholder="Enter your message"
              required
            />

            <DatePicker
              name="date"
              label="Select Date"
              placeholder="Choose a date"
              required
            />

            <Select
              name="category"
              label="Category"
              placeholder="Select a category"
              options={[
                { value: "support", label: "Support" },
                { value: "feedback", label: "Feedback" },
                { value: "feature", label: "Feature Request" },
              ]}
              required
            />

            <Button type="submit" className="w-full mt-4">
              Submit
            </Button>
          </Form>
        </ComponentExample>

        {/* Form Components without React Hook Form */}
        <ComponentExample
          title="Form Components without React Hook Form"
          description="Using form components in standalone mode"
          code={`import { Input, TextArea, DatePicker, Select, Button } from "@/components/Dexain";
import { Search } from "lucide-react";
import { useState } from "react";

// State management for non-React Hook Form usage
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [date, setDate] = useState(null);
const [category, setCategory] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  console.log({ email, message, date, category });
};

<form onSubmit={handleSubmit}>
  <Input
    formik={false}
    label="Search"
    prefix={<Search className="h-4 w-4 text-gray-400" />}
    placeholder="Search..."
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  
  <TextArea
    formik={false}
    label="Message"
    placeholder="Enter your message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
  
  <DatePicker
    formik={false}
    label="Date"
    placeholder="Select a date"
    value={date}
    onChange={(value) => setDate(value)}
  />
  
  <Select
    formik={false}
    label="Category"
    placeholder="Select a category"
    options={[
      { value: "support", label: "Support" },
      { value: "feedback", label: "Feedback" }
    ]}
    value={category}
    onChange={(value) => setCategory(value)}
  />
  
  <Button type="submit" className="mt-4">
    Submit
  </Button>
</form>`}
        >
          <Input
            label="Search"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            placeholder="Search..."
            onChange={(event) => console.log(event.target.value)}
          />
          <TextArea
            label="Message"
            placeholder="Enter your message"
            onChange={(value) => console.log(value)}
          />
          <DatePicker
            label="Date"
            placeholder="Select a date"
            onChange={(value) => console.log(value)}
          />
          <Select
            label="Category"
            placeholder="Select a category"
            options={[
              { value: "support", label: "Support" },
              { value: "feedback", label: "Feedback" },
            ]}
            value={option}
            onChange={(value) => setOption(value)}
          />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </ComponentExample>

        {/* Set Field Value Example */}
        <ComponentExample
          title="Set Field Value"
          description="Example showing how to programmatically set field values using the Form component's setValue method."
          code={`import { Form, Input, Button, Select } from "@/components/Dexain";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const SetFieldValueExample = () => {
  const validationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
  });

  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
    },
    resolver: zodResolver(validationSchema),
  });

  const handleSetValues = () => {
    methods.setValue("name", "John Doe");
    methods.setValue("category", "support");
  };

  const handleClearValues = () => {
    methods.setValue("name", "");
    methods.setValue("category", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSetValues} variant="outline">
          Set Values
        </Button>
        <Button onClick={handleClearValues} variant="outline">
          Clear Values
        </Button>
      </div>
      
      <Form
        methods={methods}
        validation={validationSchema}
        onSubmit={(values) => console.log(values)}
      >
        <Input
          name="name"
          label="Name"
          placeholder="Enter your name"
        />
        
        <Select
          name="category"
          label="Category"
          placeholder="Select a category"
          options={[
            { value: "support", label: "Support" },
            { value: "feedback", label: "Feedback" },
            { value: "bug", label: "Bug Report" }
          ]}
        />
        
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};`}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  methods.setValue("name", "John Doe");
                  methods.setValue("category", "bug");
                }}
                variant="outline"
              >
                Set Values
              </Button>
              <Button
                onClick={() => {
                  methods.setValue("name", "");
                  methods.setValue("category", "");
                }}
                variant="outline"
              >
                Clear Values
              </Button>
            </div>

            <Form methods={methods} onSubmit={(values) => console.log(values)}>
              <Input name="name" label="Name" placeholder="Enter your name" />

              <Select
                name="category"
                label="Category"
                placeholder="Select a category"
                options={[
                  { value: "support", label: "Support" },
                  { value: "feedback", label: "Feedback" },
                  { value: "bug", label: "Bug Report" },
                ]}
              />

              <Button type="submit" className="w-full mt-4">
                Submit
              </Button>
            </Form>
          </div>
        </ComponentExample>

        {/* Form Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Form Props</h3>
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
                    initialValues
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Object
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    { }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Initial form values
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    validation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Zod Schema
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Zod validation schema for form validation
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    onSubmit
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Function
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    required
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Function called when form is submitted
                  </td>
                </tr>
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
                    Form content components
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    id
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    String
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Form ID attribute
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

export default FormExample;
