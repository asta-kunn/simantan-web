import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilLine, History } from "lucide-react";
import ChildTableCell from "./child-table-cell";


const TableWithAccordion = ({ setIsOpen, regType = "", versionList, data, setEditedItem, urlDocument, setIsOpenHistory }) => {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6 flex items-center justify-start flex-row w-full gap-3">
                <p className="text-lg font-medium font-light">Registration Type : </p>
                <p className="font-bold text-lg">{regType}</p>
            </div>


            <div className="border-t border-stone-300 w-full mb-6"></div>

            <div className="mb-6 border-b border-stone-200">
                <div className="bg-[#F2F5F9] flex flex-row items-center justify-center w-full gap-6 py-2">
                    {versionList.map((item) => {
                        // if (!item['value']) return null
                        return <p className="w-1/5 text-center font-semibold text-lg" key={item.id}>{item.title}</p>
                    })}
                </div>
                <div className=" flex flex-row items-center justify-center w-full gap-6 py-2">
                    {versionList.map((item) => {
                        // if (!item['value']) return null
                        if (item.title === "MA Number And Version") {
                            return <a target="_blank" href={`https://portal21.dexagroup.com/dss/component_services/plm_nie/upload/local/${urlDocument}`} className="w-1/5 text-center font-semibold text-lg" key={item.id}>{item.value}</a>
                        }
                        return <p className="w-1/5 text-center font-semibold text-lg" key={item.id}>{item.value}</p>
                    })}
                </div>
            </div>

            <div>
                <Accordion type="multiple" collapsible="true" className="w-full">
                    {data.map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="my-2">
                            <AccordionTrigger className={`px-4 py-3 hover:bg-gray-50 rounded-md`}>
                                <span className="font-medium text-lg">{item.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4">
                                    <Table>
                                        <TableHeader className="bg-plm-grey">
                                            <TableRow>
                                                <TableHead>Item No</TableHead>
                                                <TableHead>Select</TableHead>
                                                <TableHead>MFG Code</TableHead>
                                                <TableHead>MFG Source</TableHead>
                                                <TableHead>Current Address</TableHead>
                                                <TableHead>New Address</TableHead>
                                                <TableHead>Edit</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className='w-full'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                        {/* <TableBody>
                                            {item.children.map((child, parentId) => (
                                                <TableRow key={child.id} >
                                                    <TableCell className="w-[12%]">{child.name}</TableCell>
                                                    <TableCell className="w-[10%]">
                                                        {child.subchild.map((subchild, subchildIdx) => (
                                                            <div className="flex flex-col gap-4 min-h-48 my-2 justify-center" key={subchild.change_value.id}>
                                                                <Checkbox
                                                                    name={`checkbox-${subchild.change_value.id}`}
                                                                    className="data-[state=checked]:bg-[#B32017]"
                                                                    disabled
                                                                    checked={subchild.change_value.isChecked || false}
                                                                />
                                                            </div>
                                                        ))}
                                                    </TableCell>
                                                    <ChildTableCell
                                                        key={454342}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="manufacturing_code"
                                                        renderItem={(subchild, label) => (
                                                            <div className="flex flex-col gap-4 min-h-48 my-2 justify-center">
                                                                <p className="font-semibold text-lg">{subchild.change_value[label]}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={353342}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="manufacturing_source"
                                                        renderItem={(subchild, label) => (
                                                            <div className="flex flex-col gap-4 min-h-48  my-2 justify-center">
                                                                <p className="font-semibold text-lg">{subchild.change_value[label]}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={4232325}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        renderItem={(subchild, label) => (
                                                            <div className="flex flex-col gap-4 min-h-48 my-2 justify-center">
                                                                <p className="font-semibold text-lg">{subchild.stick_value[label]}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={2222}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        renderItem={(subchild, label) => (
                                                            <div className="flex flex-col gap-4 min-h-48 my-2  justify-center">
                                                                <p className="font-semibold text-lg">{subchild.change_value['isUpdated'] ? subchild.change_value['address'] : ""}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={11111}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="edit"
                                                        renderItem={(subchild, label) => (
                                                            <div className="flex flex-col gap-4 min-h-48 my-2  justify-center">
                                                                <div className="flex flex-row gap-4">
                                                                    <PencilLine className="w-4 h-4 cursor-pointer" onClick={() => {
                                                                        setEditedItem({
                                                                            mapping_id: {
                                                                                item_id: item.id,
                                                                                child_id: child.id,
                                                                                subchild_id: subchild.change_value.id
                                                                            },
                                                                            stick_value: { ...subchild.stick_value },
                                                                            change_value: { ...subchild.change_value }
                                                                        })
                                                                        setIsOpen({
                                                                            mapping_id: {
                                                                                item_id: item.id,
                                                                                child_id: child.id,
                                                                                subchild_id: subchild.change_value.id
                                                                            },
                                                                            stick_value: { ...subchild.stick_value },
                                                                            change_value: { ...subchild.change_value }
                                                                        })
                                                                    }} />
                                                                    <History className="w-4 h-4 cursor-pointer" onClick={() => {
                                                                        setIsOpenHistory({ isOpen: true, data: subchild.stick_value.manufacturing_code })
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                </TableRow>
                                            ))}
                                        </TableBody> */}
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default TableWithAccordion;