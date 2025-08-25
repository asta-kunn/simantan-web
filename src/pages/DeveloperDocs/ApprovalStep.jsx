import React from "react";

/**
 * Component to display approval information in timeline steps
 */
export const ApprovalStep = ({
  title,
  name,
  email,
  position,
  company,
  date,
  time,
  remarks
}) => {
  return (
    <div className="p-3 min-w-[250px]">
      <h4 className="font-medium text-base mb-1">{title}</h4>
      <div className="mb-3">
        <div className="font-medium">{name}</div>
        {email && <div className="text-sm text-gray-500">{email}</div>}
        <div className="text-sm text-gray-700">{position}</div>
        <div className="text-sm text-gray-700">{company}</div>
        {date && (
          <div className="text-xs text-gray-500 mt-2">
            {date} {time && `at ${time}`}
          </div>
        )}
      </div>
      {remarks && (
        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
          <div className="font-medium text-xs mb-1">Remarks:</div>
          <div className="text-sm">{remarks}</div>
        </div>
      )}
    </div>
  );
}; 