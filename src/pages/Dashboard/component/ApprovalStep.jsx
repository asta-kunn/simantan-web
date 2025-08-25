import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Component for displaying a submission or approval step in the timeline
 */
export const ApprovalStep = ({ 
  title, 
  name, 
  email, 
  position, 
  company, 
  date, 
  time,
  remarks,
  className 
}) => {
  const isApproved = title?.toLowerCase().includes('approved');
  
  return (
    <div className={cn("p-4 rounded-md border border-gray-100 bg-white w-full", className)}>
      {/* First row: Title and date */}
      <div className="flex justify-between items-start w-full mb-2">
        <div className={cn(
          "text-base font-medium",
          isApproved ? "text-green-500" : ""
        )}>
          {title}
        </div>
        
        {date && (
          <div className="text-right text-sm text-gray-600 ml-auto">
            <div>{date}</div>
          </div>
        )}
      </div>
      
      {/* Second row: Name/email and time */}
      <div className="flex justify-between items-start w-full">
        {name && (
          <div className="max-w-[75%]">
            <p className="text-base font-medium break-words">{name} {email && <span className="text-sm font-normal text-gray-500 break-all">({email})</span>}</p>
          </div>
        )}
        
        {time && (
          <div className="text-right text-sm text-gray-600 ml-auto">
            <div>{time}</div>
          </div>
        )}
      </div>
      
      {/* Third row: Position/company */}
      {(position || company) && (
        <div className="mt-1">
          {position && company && (
            <p className="text-sm text-gray-600">{position} - {company}</p>
          )}
          {position && !company && (
            <p className="text-sm text-gray-600">{position}</p>
          )}
        </div>
      )}

      {/* Fourth row: Remarks */}
      {remarks && (
        <div className="mt-3 p-2 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Remarks</span><br/>
            {remarks}
          </p>
        </div>
      )}
    </div>
  );
}; 