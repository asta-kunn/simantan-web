import React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  TableBody as ShadcnTableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export const TableBody = ({
  table,
  onRowClick,
  getCaption,
  emptyStateMessage = "No results.",
}) => {
  const sizeClass = "text-sm py-2 px-3";
  const alignClass = "text-left";

  return (
    <ShadcnTableBody className="w-full">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row, rowIdx) => {
          // Check if row is disabled
          const isRowDisabled = row.original.__isDisabled;

          // Default row styling
          let rowClass = "bg-white";

          // hover - only if not disabled
          if (!isRowDisabled) {
            rowClass += " hover:bg-primary-soft transition-colors";
          }

          return (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={`${onRowClick && !isRowDisabled ? `cursor-pointer ${rowClass}` : rowClass} ${isRowDisabled ? 'opacity-50' : ''}`}
              onClick={() => onRowClick && !isRowDisabled && onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => {
                const caption = cell.column.columnDef.caption;
                let cellClass = `${sizeClass} ${alignClass}`;

                if (isRowDisabled) {
                  cellClass += " text-disable-normal";
                }

                return (
                  <TableCell key={cell.id} className={cellClass}>
                    <div>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {caption && (
                        <div className="text-xs text-gray-400 mt-0.5 leading-tight">
                          {caption}
                        </div>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className={`h-24 text-center ${sizeClass}`}
          >
            {emptyStateMessage}
          </TableCell>
        </TableRow>
      )}
    </ShadcnTableBody>
  );
};
