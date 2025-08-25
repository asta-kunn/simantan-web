import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const TableHistory = ({ data }) => {
    return (
        <div>
            <Table className="border" >
                <TableHeader className="bg-[#F2F5F9]" >
                    <TableRow>
                        <TableHead className="max-w-1/5">Update History</TableHead>
                        <TableHead className="max-w-1/5">Registration Type</TableHead>
                        <TableHead className="max-w-1/5">AVL Version</TableHead>
                        <TableHead className="max-w-1/5">NIE. Version</TableHead>
                        <TableHead className="max-w-1/5">NIE. Number</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map((item) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell className="max-w-1/5">{item.ACTION_PLAN}</TableCell>
                                <TableCell className="max-w-1/5">{item.REGISTRATION_TYPE}</TableCell>
                                <TableCell className="max-w-1/5">{item.AVL_VERSION}</TableCell>
                                <TableCell className="max-w-1/5">{item.NIE_VERSION}</TableCell>
                                <TableCell className="max-w-1/5">{item.NIE_NUMBER}</TableCell>
                            </TableRow>
                        )
                    }) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default TableHistory
