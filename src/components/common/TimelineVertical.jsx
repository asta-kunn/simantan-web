import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon, PenIcon, XIcon, AlertTriangleIcon } from 'lucide-react';

export function TimelineVertical({ items = [], children }) {
  const containerRef = useRef(null);
  const [lastItemPosition, setLastItemPosition] = useState(0);

  // Get position of last item circle to end the line there
  useEffect(() => {
    if (containerRef.current) {
      const itemsContainer = containerRef.current;
      const items = itemsContainer.querySelectorAll('.timeline-item');
      
      if (items.length > 0) {
        const lastItem = items[items.length - 1];
        const lastItemCircle = lastItem.querySelector('.timeline-circle');
        if (lastItemCircle) {
          // Calculate position relative to container
          const containerRect = itemsContainer.getBoundingClientRect();
          const circleRect = lastItemCircle.getBoundingClientRect();
          
          // Get the center of the circle's top position relative to the container
          const position = circleRect.top - containerRect.top;
          setLastItemPosition(position);
        }
      }
    }
  }, [items]);

  // Calculate which segments should be colored
  const completedSegments = [];
  const rejectedSegments = [];
  if (items?.length > 0) {
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].status === 'completed') {
        completedSegments.push(i);
      }
      if (items[i].status === 'rejected') {
        rejectedSegments.push(i);
      }
    }
  }

  // Support both children and items prop for backward compatibility
  if (children && !items?.length) {
    const childrenArray = React.Children.toArray(children);
    return (
      <div className="relative space-y-6">
        {childrenArray.map((child, idx) => 
          React.cloneElement(child, { index: idx, total: childrenArray.length })
        )}
      </div>
    );
  }

  // Use items prop if provided
  return (
    <div className="relative" ref={containerRef}>
      {/* Timeline container with limited stacking context */}
      <div className="relative isolate">
        {/* Main continuous vertical line */}
        <div 
          className="absolute left-4 top-4 w-[2px] bg-gray-300 -z-10" 
          style={{ height: lastItemPosition ? `${lastItemPosition}px` : '100%' }}
        />
        
        {/* Colored segments for completed items */}
        {completedSegments.map((idx) => {
          // Find positions for this segment
          const itemElements = containerRef.current?.querySelectorAll('.timeline-item');
          if (!itemElements || itemElements.length <= idx + 1) return null;
          
          const currentItem = itemElements[idx];
          const nextItem = itemElements[idx + 1];
          const currentCircle = currentItem.querySelector('.timeline-circle');
          const nextCircle = nextItem.querySelector('.timeline-circle');
          
          if (!currentCircle || !nextCircle) return null;
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const currentRect = currentCircle.getBoundingClientRect();
          const nextRect = nextCircle.getBoundingClientRect();
          
          const top = currentRect.top - containerRect.top + (currentRect.height / 2);
          const height = nextRect.top - currentRect.top;
          
          return (
            <div 
              key={`completed-segment-${idx}`}
              className="absolute left-4 w-[2px] bg-green-500 -z-5" 
              style={{ 
                top: `${top}px`, 
                height: `${height}px`,
                transform: 'translateX(-50%)'
              }}
            />
          );
        })}

        {/* Colored segments for rejected items */}
        {rejectedSegments.map((idx) => {
          // Find positions for this segment
          const itemElements = containerRef.current?.querySelectorAll('.timeline-item');
          if (!itemElements || itemElements.length <= idx + 1) return null;
          
          const currentItem = itemElements[idx];
          const nextItem = itemElements[idx + 1];
          const currentCircle = currentItem.querySelector('.timeline-circle');
          const nextCircle = nextItem.querySelector('.timeline-circle');
          
          if (!currentCircle || !nextCircle) return null;
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const currentRect = currentCircle.getBoundingClientRect();
          const nextRect = nextCircle.getBoundingClientRect();
          
          const top = currentRect.top - containerRect.top + (currentRect.height / 2);
          const height = nextRect.top - currentRect.top;
          
          return (
            <div 
              key={`rejected-segment-${idx}`}
              className="absolute left-4 w-[2px] bg-primary-normal -z-5" 
              style={{ 
                top: `${top}px`, 
                height: `${height}px`,
                transform: 'translateX(-50%)'
              }}
            />
          );
        })}
        
        <div className="space-y-5">
          {items?.map?.((item, idx) => (
            <Item
              key={idx}
              {...item}
              index={idx}
              total={items.length}
            >
              {item.children}
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline Item
 * This component handles the layout based on the props provided
 */
export const Item = memo(({
  status,
  statusText,
  customIcon,
  toggle,
  title,
  children,
  index = 0,
  total = 0
}) => {
  // Determine icon and background
  const isActive = status === 'started' || status === 'completed';
  const isRejected = status === 'rejected';
  
  // Icon background color based on status
  const iconBg = 
    status === 'completed' ? 'bg-green-500 text-white' : 
    status === 'started' ? 'bg-blue-500 text-white' : 
    status === 'rejected' ? 'bg-primary-normal text-white' :
    'bg-gray-200 text-gray-600';

  // Choose the appropriate icon
  const StatusIcon = customIcon 
    || (status === 'completed'
        ? <CheckIcon className="h-4 w-4" />
        : status === 'rejected'
        ? <XIcon className="h-4 w-4" />
        : <PenIcon className="h-4 w-4" />
      );

  // Status pill colors
  const statusPillBg = 
    status === 'completed' ? 'bg-green-500 text-white' : 
    status === 'rejected' ? 'bg-primary-normal text-white' : 
    status === 'started' ? 'bg-blue-500 text-white' : 
    'bg-gray-200 text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative flex items-start timeline-item"
    >
      <div className="timeline-circle">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center relative z-[1]", iconBg)}>
          {StatusIcon}
        </div>
      </div>

      <div className="flex-1 ml-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className={cn(
              "font-semibold", 
              isRejected ? "text-primary-normal" : "text-foreground"
            )}>
              {title}
            </h3>
            {toggle && <div className="ml-3">{toggle}</div>}
          </div>

          {statusText && (
            <span className={cn(
              "text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ml-auto",
              statusPillBg
            )}>
              {statusText}
            </span>
          )}
        </div>

        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
});