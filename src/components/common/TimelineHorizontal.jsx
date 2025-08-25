import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon, PenIcon, XIcon } from 'lucide-react';

// CSS styles as JavaScript objects for inline styling
const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    gap: 0,
    padding: 0
  },
  item: {
    position: 'relative',
    minWidth: '180px',
    padding: '0 5px'
  },
  itemWithLine: (status) => {
    // Determine line color based on status
    const lineColor = 
      status === 'completed' ? '#10b981' : // Green
      status === 'rejected' ? '#ef4444' : // Red
      '#e5e7eb'; // Default gray
      
    return {
      position: 'relative',
      minWidth: '180px',
      padding: '0 5px',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '16px',
        left: '36px',
        height: '2px',
        right: '-20px',
        zIndex: 0,
        backgroundColor: lineColor
      }
    };
  },
  circle: {
    position: 'relative',
    zIndex: 10,
    marginRight: '10px'
  },
  content: {
    marginTop: '16px'
  }
};

export function TimelineHorizontal({ items = [], children, className }) {
  // Support both children and items prop for backward compatibility
  if (children && !items?.length) {
    const childrenArray = React.Children.toArray(children);
    return (
      <div className="relative space-x-6 flex">
        {childrenArray.map((child, idx) => 
          React.cloneElement(child, { index: idx, total: childrenArray.length })
        )}
      </div>
    );
  }

  // Use items prop if provided
  return (
    <div className={cn("relative w-full overflow-auto", className)}>
      <div style={styles.container}>
        {items?.map?.((item, idx) => (
          <ItemHorizontal
            key={idx}
            {...item}
            index={idx}
            total={items.length}
            isLast={idx === items.length - 1}
          >
            {item.children}
          </ItemHorizontal>
        ))}
      </div>
    </div>
  );
}

/**
 * Timeline Item Horizontal
 * This component handles the layout based on the props provided
 */
export const ItemHorizontal = memo(({
  status,
  customIcon,
  toggle,
  title,
  children,
  index = 0,
  total = 0,
  isLast = false
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
      
  // Line styles based on status
  const lineColor = 
    status === 'completed' ? '#10b981' : // Green
    status === 'rejected' ? '#ef4444' : // Red
    '#e5e7eb'; // Default gray

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      style={styles.item}
      className="timeline-item-horizontal"
    >
      {/* Circle */}
      <div style={styles.circle}>
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", iconBg)}>
          {StatusIcon}
        </div>
      </div>
      
      {/* Line to next item */}
      {!isLast && (
        <div 
          style={{
            position: 'absolute',
            top: '16px',
            left: '36px',
            height: '2px',
            right: '-20px',
            zIndex: 0,
            backgroundColor: lineColor
          }}
        />
      )}

      {/* Content */}
      <div style={styles.content}>
        {children}
      </div>
    </motion.div>
  );
});