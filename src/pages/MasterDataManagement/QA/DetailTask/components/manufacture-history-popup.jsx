import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/utils";

const dataDummy = [
  {
    ADDRESS_LINE1: "Jl. Contoh No. 1",
    ADDRESS_LINE2: "Gedung A",
    POSTAL_CODE: "12345",
    CITY: "Jakarta",
    COUNTRY: "Indonesia"
  },

];

export const QAManufactureHistoryPopup = ({ isOpen, setIsOpen, onClose, data = [...dataDummy] }) => {

  const columns = [
    {
      accessorKey: "index",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "ADDRES_LINE1",
      header: "Address Line 1",
    },
    {
      accessorKey: "ADDRESS_LINE2",
      header: "Address Line 2",
    },
    {
      accessorKey: "POSTAL_CODE",
      header: "Postal Code",
    },
    {
      accessorKey: "CITY",
      header: "City",
    },
    {
      accessorKey: "COUNTRY",
      header: "Country",
    },
    {
      accessorKey: "CREATED_BY",
      header: "Edited By",
    },
    {
      accessorKey: 'CREATION_DATE',
      header: 'Edited Date',
      cell: ({ row }) => formatTime(row.original.CREATION_DATE)
    }
  ];

  console.log(data, 'DATA HISTORY')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>History Manufacturer</DialogTitle>
          <div className="my-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Tidak ada data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => { onClose() }}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
