import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const TableQAListSkeleton = () => {
    return (
        <div>
            <div className="rounded-lg min-h-40 p-4">
                <div className="relative w-full ">
                    <div className="rounded-md border ">
                        <div className="overflow-x-auto">
                            <Table className="overflow-x-auto">
                                <TableHeader className="bg-[#E9EEF5]">
                                    <TableRow>
                                        <TableCell className="sticky left-0 bg-[#E9EEF5] z-10 w-16 min-w-16">
                                            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="sticky left-16 bg-[#E9EEF5] z-10 w-48 min-w-48">
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="w-[250px] min-w-[250px]">
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="w-[150px] min-w-[150px]">
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="w-[200px] min-w-[200px]">
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="w-[150px] min-w-[150px]">
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="w-[150px] min-w-[150px]">
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="sticky right-0 bg-[#E9EEF5] z-10 w-[100px] min-w-[50px]">
                                            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="sticky left-0 bg-white z-10 w-10 min-w-10">
                                                <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="sticky left-16 bg-white z-8 w-48 min-w-48">
                                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="w-[250px] min-w-[250px]">
                                                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">
                                                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="w-[200px] min-w-[200px]">
                                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">
                                                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">
                                                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell className="sticky right-0 bg-white z-10 w-[50px] min-w-[50px]">
                                                <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default TableQAListSkeleton
