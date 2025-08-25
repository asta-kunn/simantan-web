import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { DatePicker } from "@/components/fields/DatePicker";

const datePickerProps = [
  { prop: "label", type: "string", default: "undefined", description: "Label text displayed above the input" },
  { prop: "name", type: "string", default: "undefined", description: "Field name (required for form integration with react-hook-form)" },
  { prop: "value", type: "Date", default: "undefined", description: "Current value (for controlled components)" },
  { prop: "onChange", type: "function", default: "undefined", description: "Event handler for when the date changes" },
  { prop: "required", type: "boolean", default: "false", description: "Whether the input is required (adds red asterisk)" },
  { prop: "disabled", type: "boolean", default: "false", description: "Whether the input is disabled" },
  { prop: "minDate", type: "Date | string", default: "undefined", description: "Minimum selectable date" },
  { prop: "maxDate", type: "Date | string", default: "undefined", description: "Maximum selectable date" },
  { prop: "format", type: "string", default: "'DD MMMM YYYY'", description: "Date display format (uses moment.js)" },
  { prop: "info", type: "string", default: "undefined", description: "Tooltip text displayed on info icon hover" },
  { prop: "caption", type: "string", default: "undefined", description: "Helper text displayed below the input" },
  { prop: "className", type: "string", default: "''", description: "Additional CSS classes to apply to the input" },
];

/**
 * DatePicker component documentation and examples
 */
const DatePickerExample = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [defaultDate, setDefaultDate] = useState();
  const [disabledDate, setDisabledDate] = useState();
  const [captionDate, setCaptionDate] = useState();

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">DatePicker</h2>
        <i className="text-gray-400 text-lg">
          A versatile date picker component that supports various states and customizations. Features include form integration with react-hook-form, validation, min/max date constraints, info tooltips, and animated error messages.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic DatePicker */}
        <ComponentExample
          title="Basic DatePicker"
          description="Standard date picker with label and required state"
          code={`import { DatePicker } from "@/components/fields/DatePicker";

<DatePicker
  name="date_example"
  label="Date"
  required
  info="select date"
  caption="Format: DD MMMM YYYY"
  minDate={new Date(2000, 0, 1)}
  maxDate={new Date(2030, 11, 31)}
  value={selectedDate}
  onChange={setSelectedDate}
  format="D MMMM YYYY"
/>`}
        >
          <DatePicker
            name="date_example"
            label="Date"
            required
            info="select date"
            caption="Format: DD MMMM YYYY"
            minDate={new Date(2000, 0, 1)}
            maxDate={new Date(2030, 11, 31)}
            value={selectedDate}
            onChange={setSelectedDate}
            format="D MMMM YYYY"
          />
          <div className="text-sm text-gray-600 mt-2">
            selected date: {selectedDate ? selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
          </div>
        </ComponentExample>

        {/* DatePicker States */}
        <ComponentExample
          title="DatePicker States"
          description="Various date picker states including default, disabled, and with caption"
          code={`import { DatePicker } from "@/components/fields/DatePicker";

// Default state
<DatePicker
  name="default_date"
  label="Default Date"
  format="D MMMM YYYY"
  value={defaultDate}
  onChange={setDefaultDate}
/>

// Disabled state
<DatePicker
  name="disabled_date"
  label="Disabled Date"
  disabled
  format="D MMMM YYYY"
  value={disabledDate}
  onChange={setDisabledDate}
/>

// With caption
<DatePicker
  name="date_with_caption"
  label="Date with Caption"
  caption="Please select a date within this month"
  format="D MMMM YYYY"
  value={captionDate}
  onChange={setCaptionDate}
/>`}
        >
          <div className="space-y-4">
            <div>
              <DatePicker
                name="default_date"
                label="Default Date"
                format="DD MMMM YYYY"
                value={defaultDate}
                onChange={setDefaultDate}
              />
                <div className="text-sm text-gray-600 mt-2">
                  selected date: {defaultDate ? defaultDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </div>
              </div>

            <div>
              <DatePicker
                name="disabled_date"
                label="Disabled Date"
                disabled
                format="DD MMMM YYYY"
                value={disabledDate}
                onChange={setDisabledDate}
              />
              <div className="text-sm text-gray-600 mt-2">
                selected date: {disabledDate ? disabledDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>

            <div>
              <DatePicker
                name="date_with_caption"
                label="Date with Caption"
                caption="Please select a date within this month"
                format="DD MMMM YYYY"
                value={captionDate}
                onChange={setCaptionDate}
              />
              <div className="text-sm text-gray-600 mt-2">
                selected date: {captionDate ? captionDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>
          </div>
        </ComponentExample>

        {/* Props Table */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">DatePicker Props</h3>
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
                {datePickerProps.map((row) => (
                  <tr key={row.prop}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.prop}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.default}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatePickerExample;
