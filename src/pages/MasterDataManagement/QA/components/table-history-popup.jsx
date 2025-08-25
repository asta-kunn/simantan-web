import {
    Dialog,
    // DialogContent,
    // DialogFooter,
    // DialogHeader,
    // DialogTitle,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//     getCoreRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import { formatTime } from "@/lib/utils";
// import TableHistory from "@/components/Form/table-history";

const dataDummy = [
    {
        ADDRESS_LINE1: "Jl. Contoh No. 1",
        ADDRESS_LINE2: "Gedung A",
        POSTAL_CODE: "12345",
        CITY: "Jakarta",
        COUNTRY: "Indonesia"
    },

];

export const TableHistoryPopup = ({ isOpen, setIsOpen, onClose, data = [...dataDummy] }) => {

    // const columns = [
    //     {
    //         accessorKey: "index",
    //         header: "No",
    //         cell: ({ row }) => row.index + 1,
    //     },
    //     {
    //         accessorKey: "ADDRES_LINE1",
    //         header: "Address Line 1",
    //     },
    //     {
    //         accessorKey: "ADDRESS_LINE2",
    //         header: "Address Line 2",
    //     },
    //     {
    //         accessorKey: "POSTAL_CODE",
    //         header: "Postal Code",
    //     },
    //     {
    //         accessorKey: "CITY",
    //         header: "City",
    //     },
    //     {
    //         accessorKey: "COUNTRY",
    //         header: "Country",
    //     },
    //     {
    //         accessorKey: "CREATED_BY",
    //         header: "Edited By",
    //     },
    //     {
    //         accessorKey: 'CREATION_DATE',
    //         header: 'Edited Date',
    //         cell: ({ row }) => formatTime(row.original.CREATION_DATE)
    //     }
    // ];


    // const table = useReactTable({
    //     data,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    // });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* <DialogContent className="max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="py-2">History Task</DialogTitle>
                    <TableHistory data={[]} />
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => { onClose() }}>Tutup</Button>
                </DialogFooter>
            </DialogContent> */}
        </Dialog>
    );
};
