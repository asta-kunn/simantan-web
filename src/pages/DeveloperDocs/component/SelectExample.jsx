import React, { useState, useEffect } from "react";
import { ComponentExample } from "./ComponentExample";
import { Select, Form, Button } from "@/components/Dexain";
import * as z from "zod";

// Import multiple API services for examples
import {
  getFinishedProducts,
  getUsers,
  getCompanies,
  getCountries,
  getRoles,
  getUsersByRole,
} from "@/services/master-data.service";

/**
 * Select component documentation and examples
 * Comprehensive examples including search, multiple APIs, form integration
 */
const SelectExample = () => {
  // State for different examples
  const [selectedValue, setSelectedValue] = useState("");
  const [multipleValues, setMultipleValues] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Sample static options for basic examples
  const simpleOptions = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "durian", label: "Durian" },
    { value: "elderberry", label: "Elderberry" },
  ];

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
    { value: "uk", label: "United Kingdom" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "cn", label: "China" },
    { value: "in", label: "India" },
    { value: "br", label: "Brazil" },
  ];

  // API search handlers
  const handleProductSearch = async (query) => {
    try {
      const response = await getFinishedProducts(query);
      if (response) {
        return response.map((item) => ({
          value: item.FINISHED_PRODUCT_ID,
          label: item.FINISHED_PRODUCT_DESCRIPTION,
          preview: (
            <div className="flex flex-col gap-1">
              <span className="text-md font-bold">
                {item.FINISHED_PRODUCT_DESCRIPTION}
              </span>
              <span className="text-sm text-primary-normal">
                ID: {item.FINISHED_PRODUCT_ID}
              </span>
            </div>
          ),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  const handleUserSearch = async (query) => {
    try {
      const response = await getUsers({ name: query });
      if (response) {
        return response.map((user) => ({
          value: user.USER_ID,
          label: user.NAME,
          preview: (
            <div className="flex flex-col gap-1">
              <span className="text-md font-bold">{user.NAME}</span>
              <span className="text-sm text-primary-normal">{user.EMAIL}</span>
            </div>
          ),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  const handleCountrySearch = async (query) => {
    try {
      const response = await getCountries();
      if (response) {
        return response.map((country) => ({
          value: country.COUNTRY_NAME,
          label: country.COUNTRY_NAME,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching countries:", error);
      return [];
    }
  };

  // Form validation schema
  const formValidationSchema = z.object({
    product: z.string().min(1, "Please select a product"),
    user: z.string().min(1, "Please select a user"),
    countries: z.array(z.string()).min(1, "Please select at least one country"),
  });

  useEffect(() => {
    console.log("Selected values:", {
      selectedProduct,
      selectedUser,
      selectedCountry,
    });
  }, [selectedProduct, selectedUser, selectedCountry]);

  return (
    <>
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold mb-0">Select</h2>
        <i className="text-gray-400 text-lg">
          A versatile select component that supports search, multiple selection,
          API integration, and form usage.
        </i>
      </div>

      <div className="space-y-6">
        {/* Basic Select */}
        <ComponentExample
          title="Basic Select"
          description="Standard select dropdown with static options"
          code={`import { Select } from "@/components/Dexain";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

<Select 
  label="Favorite Fruit"
  placeholder="Select a fruit"
  options={options}
  onChange={(value) => console.log(value)}
/>`}
        >
          <Select
            label="Favorite Fruit"
            placeholder="Select a fruit"
            options={simpleOptions}
            onChange={(value) => console.log(value)}
          />
        </ComponentExample>

        {/* Searchable Select */}
        <ComponentExample
          title="Searchable Select"
          description="Select with search functionality for filtering static options"
          code={`import { Select } from "@/components/Dexain";

<Select 
  label="Country"
  placeholder="Select a country"
  searchable={true}
  options={countryOptions}
  onChange={(value) => console.log(value)}
/>`}
        >
          <Select
            label="Country"
            placeholder="Select a country"
            searchable={true}
            options={countryOptions}
            onChange={(value) => console.log(value)}
          />
        </ComponentExample>

        {/* Multiple Select */}
        <ComponentExample
          title="Multiple Select"
          description="Select that allows multiple options to be chosen"
          code={`import { Select } from "@/components/Dexain";
import { useState } from "react";

const [multipleValues, setMultipleValues] = useState([]);

<Select 
  label="Multiple Fruits"
  placeholder="Select fruits"
  multiple={true}
  options={options}
  value={multipleValues}
  onChange={(values) => setMultipleValues(values)}
/>`}
        >
          <div>
            <Select
              label="Multiple Fruits"
              placeholder="Select fruits"
              multiple={true}
              options={simpleOptions}
              value={multipleValues}
              onChange={(values) => setMultipleValues(values)}
            />
            <p className="mt-2 text-sm">
              Selected:{" "}
              {multipleValues.length ? multipleValues.join(", ") : "(none)"}
            </p>
          </div>
        </ComponentExample>

        {/* Controlled Select */}
        <ComponentExample
          title="Controlled Select"
          description="Select with React state management (controlled component)"
          code={`import { Select } from "@/components/Dexain";
import { useState } from "react";

const [selectedValue, setSelectedValue] = useState("");

<Select 
  label="Controlled Select"
  placeholder="Select a fruit"
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
/>`}
        >
          <div>
            <Select
              label="Controlled Select"
              placeholder="Select a fruit"
              options={simpleOptions}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value)}
            />
            <p className="mt-2 text-sm">
              Selected value: <code>{selectedValue || "none"}</code>
            </p>
          </div>
        </ComponentExample>

        {/* API Search - Products */}
        <ComponentExample
          title="API Search - Finished Products"
          description="Debounced API search for finished products with custom preview"
          code={`import { Select } from "@/components/Dexain";
import { getFinishedProducts } from "@/services/master-data.service";

const handleProductSearch = async (query) => {
  try {
    const response = await getFinishedProducts(query);
    if (response?.data?.data) {
      return response.data.data.map((item) => ({
        value: item.FINISHED_PRODUCT_ID,
        label: item.FINISHED_PRODUCT_DESCRIPTION,
        preview: (
          <div className="flex flex-col gap-1">
            <span className="text-md font-bold">{item.FINISHED_PRODUCT_DESCRIPTION}</span>
            <span className="text-sm text-primary-normal">ID: {item.FINISHED_PRODUCT_ID}</span>
          </div>
        ),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

<Select
  label="Search Finished Products"
  placeholder="Type to search products..."
  searchable={true}
  onSearch={handleProductSearch}
  value={selectedProduct}
  onChange={setSelectedProduct}
  debounceTime={500}
/>`}
        >
          <div>
            <Select
              label="Search Finished Products"
              placeholder="Type to search products..."
              searchable={true}
              onSearch={handleProductSearch}
              value={selectedProduct}
              onChange={setSelectedProduct}
              debounceTime={500}
            />
            <p className="mt-2 text-sm">
              Selected product: <code>{selectedProduct || "none"}</code>
            </p>
          </div>
        </ComponentExample>

        {/* API Search - Users */}
        <ComponentExample
          title="API Search - Users"
          description="Search users with email preview and debounced API calls"
          code={`import { Select } from "@/components/Dexain";
import { getUsers } from "@/services/master-data.service";

const handleUserSearch = async (query) => {
  try {
    const response = await getUsers({ name: query });
    if (response?.data?.data) {
      return response.data.data.map((user) => ({
        value: user.USER_ID,
        label: user.USER_NAME,
        preview: (
          <div className="flex flex-col gap-1">
            <span className="text-md font-bold">{user.USER_NAME}</span>
            <span className="text-sm text-primary-normal">{user.USER_EMAIL}</span>
          </div>
        ),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

<Select
  label="Search Users"
  placeholder="Type to search users..."
  searchable={true}
  onSearch={handleUserSearch}
  value={selectedUser}
  onChange={setSelectedUser}
/>`}
        >
          <div>
            <Select
              label="Search Users"
              placeholder="Type to search users..."
              searchable={true}
              onSearch={handleUserSearch}
              value={selectedUser}
              onChange={setSelectedUser}
            />
            <p className="mt-2 text-sm">
              Selected user: <code>{selectedUser || "none"}</code>
            </p>
          </div>
        </ComponentExample>

        {/* Advanced Select - Search + Multiple */}
        <ComponentExample
          title="Advanced Select - Search + Multiple"
          description="Combining search and multiple selection with static options"
          code={`import { Select } from "@/components/Dexain";

<Select 
  label="Multiple Countries"
  placeholder="Select countries"
  searchable={true}
  multiple={true}
  options={countryOptions}
  onChange={(values) => console.log(values)}
/>`}
        >
          <Select
            label="Multiple Countries"
            placeholder="Select countries"
            searchable={true}
            multiple={true}
            options={countryOptions}
            onChange={(values) => console.log(values)}
          />
        </ComponentExample>

        {/* Form Integration */}
        <ComponentExample
          title="Form Integration"
          description="Using Select components within a Form with validation"
          code={`import { Form, Select, Button } from "@/components/Dexain";
import * as z from "zod";

const formValidationSchema = z.object({
  product: z.string().min(1, "Please select a product"),
  user: z.string().min(1, "Please select a user"),
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

<Form
  initialValues={{
    product: "",
    user: "",
    countries: [],
  }}
  validation={formValidationSchema}
  onSubmit={(values) => {
    console.log("Form submitted with:", values);
  }}
>
  <Select
    name="product"
    label="Product"
    placeholder="Search products..."
    searchable={true}
    onSearch={handleProductSearch}
    required
  />
  
  <Select
    name="user"
    label="User"
    placeholder="Search users..."
    searchable={true}
    onSearch={handleUserSearch}
    required
  />
  
  <Select
    name="countries"
    label="Countries"
    placeholder="Select countries"
    searchable={true}
    multiple={true}
    options={countryOptions}
    required
  />
  
  <Button type="submit" className="mt-4">
    Submit Form
  </Button>
</Form>`}
        >
          <Form
            initialValues={{
              product: "",
              user: "",
              countries: [],
            }}
            validation={formValidationSchema}
            onSubmit={(values) => {
              console.log("Form submitted with:", values);
              alert("Form submitted! Check console for values.");
            }}
          >
            <div className="space-y-4">
              <Select
                name="product"
                label="Product"
                placeholder="Search products..."
                searchable={true}
                onSearch={handleProductSearch}
                required
              />

              <Select
                name="user"
                label="User"
                placeholder="Search users..."
                searchable={true}
                onSearch={handleUserSearch}
                required
              />

              <Select
                name="countries"
                label="Countries"
                placeholder="Select countries"
                searchable={true}
                multiple={true}
                options={countryOptions}
                required
              />
            </div>

            <Button type="submit" className="mt-4">
              Submit Form
            </Button>
          </Form>
        </ComponentExample>

        {/* Disabled Select */}
        <ComponentExample
          title="Disabled Select"
          description="Select in disabled state"
          code={`import { Select } from "@/components/Dexain";

<Select 
  label="Disabled Select"
  placeholder="Cannot select anything"
  options={options}
  disabled={true}
/>`}
        >
          <Select
            label="Disabled Select"
            placeholder="Cannot select anything"
            options={simpleOptions.slice(0, 3)}
            disabled={true}
          />
        </ComponentExample>

        {/* Select with Custom Preview */}
        <ComponentExample
          title="Select with Custom Preview"
          description="Select with custom preview elements for enhanced user experience"
          code={`import { Select } from "@/components/Dexain";

const statusOptions = [
  { 
    value: "active", 
    label: "Active", 
    preview: (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span>Active</span>
      </div>
    )
  },
  { 
    value: "inactive", 
    label: "Inactive", 
    preview: (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span>Inactive</span>
      </div>
    )
  },
];

<Select 
  label="Status"
  placeholder="Select status"
  options={statusOptions}
  onChange={(value) => console.log(value)}
/>`}
        >
          <Select
            label="Status"
            placeholder="Select status"
            options={[
              {
                value: "active",
                label: "Active",
                preview: (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Active</span>
                  </div>
                ),
              },
              {
                value: "inactive",
                label: "Inactive",
                preview: (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Inactive</span>
                  </div>
                ),
              },
            ]}
            onChange={(value) => console.log(value)}
          />
        </ComponentExample>

        {/* Props Documentation */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Select Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
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
                    name
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Field name (required for Form integration)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    label
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Label text displayed above the select
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    options
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Array
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    []
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Array of options with label, value, and optional preview
                    properties
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    placeholder
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    "Select an option"
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Placeholder text for the select
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    value
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string | Array
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Current value(s) for controlled usage
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    onChange
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    function
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Handler called when selection changes
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    searchable
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    boolean
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    false
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Whether to enable search functionality
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    onSearch
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    function
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Handler for API search functionality
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    debounceTime
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    number
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    300
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Debounce time in milliseconds for search
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    multiple
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    boolean
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    false
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Whether to allow multiple selections
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    disabled
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    boolean
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    false
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Whether the select is disabled
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    required
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    boolean
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    false
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Whether the field is required (for form validation)
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
                    Additional CSS classes to apply to the select
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

export default SelectExample;
