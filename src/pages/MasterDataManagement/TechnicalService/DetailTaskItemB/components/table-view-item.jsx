import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { History } from 'lucide-react';

const EmptyData = () => {
    return (
        <TableBody className="text-base">
            <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-stone-400">There is no data</TableCell>
            </TableRow>
        </TableBody>
    )
}

const FilledData = ({ data, setIsOpenHistory, history = true }) => {
    return (
        <TableBody className="text-base">
            {data.children.map((child, parentId) => (
                <TableRow key={parentId} className="" >
                    <TableCell className="w-1/3">{child.name}</TableCell>
                    <TableCell className="w-1/6 ">
                        {child.subchild.map((subchild) => (
                            <div className="my-2 flex flex-row items-center gap-2 min-h-24 justify-start" key={subchild.id}>
                                <p className="font-medium text-md">{subchild['manufacturing_code'] ?? '-'}</p>
                            </div>
                        ))}
                    </TableCell>
                    <TableCell className="w-1/6">
                        {child.subchild.map((subchild) => (
                            <div className="my-2 flex flex-row items-center gap-2 min-h-24 justify-start" key={subchild.id}>
                                <p className="text-md">{subchild.manufacturing_source ?? '-'}</p>
                            </div>
                        ))}
                    </TableCell>
                    <TableCell className={`w-1/3`}>
                        {child.subchild.map((subchild) => (
                            <div className="my-2 flex flex-row items-center gap-2 min-h-24 justify-start" key={subchild.id}>
                                <p className="text-md">{subchild.address ?? '-'}</p>
                            </div>
                        ))}
                    </TableCell>
                    {
                        history && (
                            <TableCell>
                                {child.subchild.map((subchild, index) => (
                                    <div className="my-2 flex flex-row items-center gap-2 min-h-24 justify-start" key={subchild.id}>
                                        <History key={index} className="w-4 h-4 cursor-pointer" onClick={() => {
                                            setIsOpenHistory({ isOpen: true, data: subchild.manufacturing_code })
                                        }} />
                                    </div>
                                ))}
                            </TableCell>
                        )
                    }
                </TableRow>
            ))}
        </TableBody>
    )
}

const TableViewItem = ({ data, regType, setIsOpenHistory, dataVersion, file, title, history = true }) => {
    if (!data) return null;
    return (
        <div className="container mx-auto py-8 px-4">

            {
                regType && (
                    <div className="mb-6 flex items-center justify-start flex-row w-full gap-3">
                        <label className="font-light text-md">Registration Type :</label>
                        <p className="font-medium text-md">{regType}</p>
                    </div>
                )
            }

            <div className="border-t border-stone-300 w-full mb-6"></div>

            {title && title.segment === 'A' && (
                <div className="mb-6 border-b border-stone-200">
                    <div className="bg-[#F2F5F9] flex flex-row items-center justify-center w-full gap-6 py-2">
                        {dataVersion.map((item) => {
                            return <p className="w-1/5 text-center font-semibold text-md" key={item.id}>{item.title}</p>
                        })}
                    </div>
                    <div className=" flex flex-row items-center justify-center w-full gap-6 py-2">
                        {dataVersion.map((item) => {
                            if (item.title === "MA Number And Version") {
                                return <a target="_blank" href={`https://portal21.dexagroup.com/dss/component_services/plm_nie/upload/local/${file}`} className="w-1/5 text-center font-medium text-md" key={item.id}>{item.value}</a>
                            }
                            return <p className="w-1/5 text-center font-medium text-md" key={item.id}>{item.value}</p>
                        })}
                    </div>
                </div>
            )}
            <div className="container p-4 bg-stone-100 rounded-lg overflow-y-auto max-h-[50vh]">
                {data.map((item) => {
                    return (
                        <div className="bg-white p-2 rounded-lg my-2 border border-stone-200" key={item.id}>
                            <h1 className="text-md font-medium px-1 py-2">{item.title}</h1>
                            <Table >
                                <TableHeader >
                                    <TableRow>
                                        <TableHead>Item No</TableHead>
                                        <TableHead>MFG Code</TableHead>
                                        <TableHead>MFG Source</TableHead>
                                        <TableHead>Address</TableHead>
                                        {history && <TableHead>Action</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                {item.children.length < 1 ? <EmptyData /> : (<FilledData data={item} setIsOpenHistory={setIsOpenHistory} history={history} />)}
                            </Table>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TableViewItem
