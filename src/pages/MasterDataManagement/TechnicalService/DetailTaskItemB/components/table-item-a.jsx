import { Table } from '@/components/ui/table';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const TableItemAList = ({ data }) => {

    if (!data) return null;

    if (data.length < 1) return null;

    return (
        <div className="p-4">
            <p className="font-semibold text-lg py-2">Finish Good</p>
            <Table className="border border-slate-300">
                <TableHeader className="bg-plm-grey" >
                    <TableRow>
                        <TableHead className="max-w-1/6 text-base">FG Number</TableHead>
                        <TableHead className="max-w-1/6 text-base">Recipe Version</TableHead>
                        <TableHead className="max-w-1/6 text-base">Formula Version</TableHead>
                        <TableHead className="max-w-1/6 text-base">AVL Version</TableHead>
                        <TableHead className="max-w-1/6 text-base">NIE Number</TableHead>
                        <TableHead className="max-w-1/6 text-base">MA Number</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => {
                        return (
                            <TableRow className="border-b" key={index}>
                                <TableCell className="max-w-1/6 text-base">{item.ITEM_FG_NUMBER}</TableCell>
                                <TableCell className="max-w-1/6 text-base">{item.ORA_RECIPE_VERSION}</TableCell>
                                <TableCell className="max-w-1/6 text-base">{item.ORA_FORMULA_VERSION}</TableCell>
                                <TableCell className="max-w-1/6 text-base">{item.AVL_FORMULA_VERSION}</TableCell>
                                <TableCell className="max-w-1/6 text-base">
                                    <a href={`https://portal21.dexagroup.com/dss/component_services/plm_nie/upload/local/${item.FILE_DOCUMENT_NIE}`} target='_blank'>{item.INFOTEHNA_DOCUMENT_NUMBER}</a>
                                </TableCell>
                                <TableCell className="max-w-1/6 text-base">{item.REGISTRATION_TYPE ?? '-'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};