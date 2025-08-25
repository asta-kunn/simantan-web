import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { RangeDatePicker } from "@/components/fields/RangeDatePicker";

const rangeDatePickerProps = [
  { prop: "label", type: "string", default: "undefined", description: "Label text displayed above the input" },
  { prop: "name", type: "string", default: "undefined", description: "Field name (required for form integration with react-hook-form)" },
  { prop: "value", type: "{ from: Date, to: Date }", default: "undefined", description: "Current value (for controlled components)" },
  { prop: "onChange", type: "function", default: "undefined", description: "Event handler for when the date range changes" },
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
 * RangeDatePicker component documentation and examples
 */
const RangePickerExample = () => {
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [defaultRange, setDefaultRange] = useState({ from: undefined, to: undefined });
  const [disabledRange, setDisabledRange] = useState({ from: undefined, to: undefined });
  const [captionRange, setCaptionRange] = useState({ from: undefined, to: undefined });

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">RangeDatePicker</h2>
        <i className="text-gray-400 text-lg">
          A versatile date range picker component that supports various states and customizations. Features include form integration with react-hook-form, validation, min/max date constraints, info tooltips, and animated error messages.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic RangeDatePicker */}
        <ComponentExample
          title="Basic RangeDatePicker"
          description="Standard date range picker with label and required state"
          code={`import { RangeDatePicker } from "@/components/fields/RangeDatePicker";

<RangeDatePicker
  name="range_example"
  label="Period"
  required
  info="select range date"
  caption="max 30 days"
  minDate={new Date()}
  maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
  value={range}
  onChange={setRange}
  format="DD MMMM YYYY"
/>`}
        >
          <RangeDatePicker
            name="range_example"
            label="Period"
            required
            info="select range date"
            caption="max 30 days"
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
            value={range}
            onChange={setRange}
            format="DD MMMM YYYY"
          />
          <div className="text-sm text-gray-600 mt-2">
            selected range: {range.from ? range.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} s/d {range.to ? range.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
          </div>
        </ComponentExample>

        {/* RangeDatePicker States */}
        <ComponentExample
          title="RangeDatePicker States"
          description="Various date range picker states including default, disabled, and with caption"
          code={`import { RangeDatePicker } from "@/components/fields/RangeDatePicker";

// Default state
<RangeDatePicker
  name="default_range"
  label="Default Range"
  format="DD MMMM YYYY"
  value={defaultRange}
  onChange={setDefaultRange}
/>

// Disabled state
<RangeDatePicker
  name="disabled_range"
  label="Disabled Range"
  disabled
  format="DD MMMM YYYY"
  value={disabledRange}
  onChange={setDisabledRange}
/>

// With caption
<RangeDatePicker
  name="range_with_caption"
  label="Range with Caption"
  caption="Please select dates within the next 30 days"
  format="DD MMMM YYYY"
  value={captionRange}
  onChange={setCaptionRange}
/>`}
        >
          <div className="space-y-4">
            <div>
              <RangeDatePicker
                name="default_range"
                label="Default Range"
                format="DD MMMM YYYY"
                value={defaultRange}
                onChange={setDefaultRange}
              />
              <div className="text-sm text-gray-600 mt-2">
                selected range: {defaultRange.from ? defaultRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} s/d {defaultRange.to ? defaultRange.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>

            <div>
              <RangeDatePicker
                name="disabled_range"
                label="Disabled Range"
                disabled
                format="DD MMMM YYYY"
                value={disabledRange}
                onChange={setDisabledRange}
              />
              <div className="text-sm text-gray-600 mt-2">
                selected range: {disabledRange.from ? disabledRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} s/d {disabledRange.to ? disabledRange.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>

            <div>
              <RangeDatePicker
                name="range_with_caption"
                label="Range with Caption"
                caption="Please select dates within the next 30 days"
                format="DD MMMM YYYY"
                value={captionRange}
                onChange={setCaptionRange}
              />
              <div className="text-sm text-gray-600 mt-2">
                selected range: {captionRange.from ? captionRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} s/d {captionRange.to ? captionRange.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>
          </div>
        </ComponentExample>

        {/* Props Table */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">RangeDatePicker Props</h3>
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
                {rangeDatePickerProps.map((row) => (
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

export default RangePickerExample;
