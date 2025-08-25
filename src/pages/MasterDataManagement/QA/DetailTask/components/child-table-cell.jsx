import { TableCell } from '@/components/ui/table'
import React from 'react'

const ChildTableCell = ({ items, label, keyProp, renderItem, className="w-[12%]" }) => {
  return (
    <TableCell className={`${className}`}>
      {items.map((item, idx) => {
        return (
          <div key={`${item[keyProp]}${idx}`}>
            {renderItem(item, label)}
          </div>
        );
      })}
    </TableCell>
  )
}

export default ChildTableCell