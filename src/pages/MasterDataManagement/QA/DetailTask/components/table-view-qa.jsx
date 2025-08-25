import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dot, History } from 'lucide-react';
import { STATUS_TYPE } from '@/constants/status-task-avl';



const TableViewQA = ({ data, regType, versionList, status, urlDocument, setIsOpenHistory }) => {

    const renderInfo = () => {
        if (status === STATUS_TYPE.APPROVED) return <p className="text-lg font-medium bg-green-700 text-white px-4 py-1 rounded-full">{STATUS_TYPE.APPROVED}</p>
        if (status === STATUS_TYPE.WAITING_APPROVAL) return <p className="text-lg font-medium bg-stone-400 text-white px-4 py-1 rounded-full">{STATUS_TYPE.WAITING_APPROVAL}</p>
        return <p className="text-lg font-medium bg-plm-rose text-white px-4 py-1 rounded-full">{STATUS_TYPE.REJECT}</p>
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-row items-center justify-between mb-6 ">
                <div className="flex items-center justify-start flex-row gap-3">
                    <label className="text-lg  font-light">Registration Type :</label>
                    <p className="text-lg font-medium">{regType}</p>
                </div>
                <div>
                    {renderInfo()}
                </div>
            </div>

            <div className="border-t border-stone-300 w-full mb-6"></div>

            <div className="mb-6 border-b border-stone-200">
                <div className="bg-[#F2F5F9] flex flex-row items-center justify-center w-full gap-6 py-2">
                    {versionList.map((item) => {
                        // if (!item['value']) return null
                        return <p className="w-1/5 text-center text-lg font-semibold" key={item.id}>{item.title}</p>
                    })}
                </div>
                <div className=" flex flex-row items-center justify-center w-full gap-6 py-2">
                    {versionList.map((item) => {
                        // if (!item['value']) return null
                        if (item.title === "MA Number And Version") {
                            return <a target="_blank" href={`https://portal.dexagroup.com/dss/component_services/plm_nie/upload/local/${urlDocument}`} className="w-1/5 text-center font-semibold text-lg" key={item.id}>{item.value}</a>
                        }
                        return <p className="w-1/5 text-center text-lg font-semibold" key={item.id}>{item.value}</p>
                    })}
                </div>
            </div>
            <div className="container p-4 bg-stone-100 rounded-lg overflow-y-auto max-h-[50vh]">
                {data.map((item) => (
                    item.title === "Bulk Material" ? null :
                        <div className="bg-white p-2 rounded-lg my-2 border border-stone-200" key={item.id}>
                            <h1 className="text-lg font-semibold px-1 py-2">{item.title}</h1>
                            <Table >
                                <TableHeader >
                                    <TableRow>
                                        <TableHead>Item No</TableHead>
                                        <TableHead>MFG Code (Source)</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {item.children.map((child, parentId) => (
                                        <TableRow key={parentId} >
                                            <TableCell className="w-1/4">{child.name}</TableCell>
                                            <TableCell className="w-1/4">
                                                {child.subchild.map((subchild) => (
                                                    <div className="mb-2 flex flex-row items-center gap-2 min-h-12 jusity-start" key={subchild.stick_value.id}>
                                                        <div className="w-1/8">
                                                            <Dot className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-lg">{subchild['stick_value']['manufacturing_code']} ({subchild.stick_value.manufacturing_source})</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell className="w-1/2">
                                                {child.subchild.map((subchild) => (
                                                    <div className="mb-2 flex flex-row items-center mb-2 min-h-12" key={subchild.stick_value.id}>
                                                        <p className="text-lg">{subchild.stick_value.address}</p>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {child.subchild.map((subchild, index) => (
                                                    <div className="mb-2 flex flex-row items-center mb-2 min-h-12" key={subchild.stick_value.id}>
                                                        <History key={index} className="w-4 h-4 cursor-pointer" onClick={() => {
                                                            setIsOpenHistory({ isOpen: true, data: subchild.stick_value.manufacturing_code })
                                                        }} />
                                                    </div>

                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                ))}
            </div>
        </div>
    )
}

export default TableViewQA
