import {
  TableHeader as ShadcnTableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export const TableHeader = ({ table }) => {
  const sizeClass = "text-sm py-2 px-3 font-bold text-black";
  
  return (
    <ShadcnTableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-tertiary-normal hover:bg-tertiary-normal">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className={`${header.column.columnDef.headerClassName || ""} ${sizeClass}`}
              style={{
                width:
                  header.column.columnDef.id === "actions"
                    ? "2rem"
                    : header.getSize() || "auto",
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </ShadcnTableHeader>
  );
};
