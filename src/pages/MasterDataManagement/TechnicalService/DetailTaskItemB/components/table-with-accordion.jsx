import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import techServiceStore from "@/stores/techServiceStore";
import ChildTableCell from "@/pages/MasterDataManagement/QA/DetailTask/components/child-table-cell";
import { History } from "lucide-react";

const filterOptions = [
    { value: "Variation", label: "Variation" },
    { value: "Notification", label: "Notification" },
    { value: "No Registration", label: "No Registration" },
];


const TableWithAccordion = ({ data, onChange, regType = "", versionList, onChangeRegType, urlDocument, setIsOpenHistory }) => {
    const detailType = techServiceStore((state) => state.detailType);
    const [modifyVersionList, setModifyVersionList] = useState(versionList)

    useEffect(() => {
        setModifyVersionList(versionList)
    }, [regType])

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-xl font-bold mb-6">Daftar Produk</h1>

            <div className="mb-6 flex items-center justify-center flex-row w-full gap-3">
                <label className="text-lg font-medium">Registration Type :</label>
                <Select value={regType} onValueChange={onChangeRegType} placeholder="Select Registration Type">
                    <SelectTrigger className="w-full md:w-1/3">
                        <SelectValue placeholder="Pilih filter" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <p className="text-lg">{option.label}</p>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border-t border-stone-300 w-full mb-6"></div>

            <div className="mb-6 border-b border-stone-200">
                <div className="bg-[#F2F5F9] flex flex-row items-center justify-center w-full gap-6 py-2">
                    {modifyVersionList.map((item) => {
                        return <p className="w-1/5 text-center font-semibold text-lg" key={item.id}>{item.title}</p>
                    })}
                </div>
                <div className=" flex flex-row items-center justify-center w-full gap-6 py-2 text-lg">
                    {modifyVersionList.map((item) => {
                        if (item.title === "MA Number And Version") {
                            return <a target="_blank" href={`https://portal.dexagroup.com/dss/component_services/plm_nie/upload/local/${urlDocument}`} className="w-1/5 text-center font-semibold" key={item.id}>{item.value}</a>
                        }
                        return <p className="w-1/5 text-center font-semibold" key={item.id}>{item.value}</p>
                    })}
                </div>
            </div>

            <div>
                <Accordion type="multiple" disabled={detailType !== 'Editable'} defaultValue={detailType !== 'Editable' ? data.map(item => item.id) : []} collapsible="true" className="w-full">
                    {data.map((item) => (
                        <AccordionItem key={`${item.id} ${item.title}`} value={item.id} className="my-2">
                            <AccordionTrigger className={`px-4 py-3 hover:bg-gray-50 rounded-md`}>
                                <span className="font-medium text-lg">{item.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4">
                                    <Table>
                                        <TableHeader className="bg-plm-grey text-lg">
                                            <TableRow>
                                                <TableHead>Item No</TableHead>
                                                <TableHead>Select</TableHead>
                                                <TableHead>MFG Code</TableHead>
                                                <TableHead>MFG Source</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            <TableRow>
                                                <TableCell className='w-full'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                        {/* <TableBody className="text-lg">
                                            {item.children.map((child, parentId) => (
                                                <TableRow key={parentId} >
                                                    <TableCell className="w-[12%]">{child.name}</TableCell>
                                                    <TableCell className="w-[6%]">
                                                        {child.subchild.map((subchild, subchildIdx) => (
                                                            <div className="flex flex-col gap-4 min-h-16 justify-center" key={`${subchild.id} ${subchildIdx}`}>
                                                                <Checkbox
                                                                    name={`checkbox-${subchild.id}`}
                                                                    className="data-[state=checked]:bg-[#B32017]"
                                                                    onCheckedChange={(checked) => {
                                                                        onChange(
                                                                            item.id,
                                                                            child.id,
                                                                            subchildIdx,
                                                                            checked
                                                                        );
                                                                    }}
                                                                    checked={subchild.isChecked || false}
                                                                    disabled={detailType !== "Editable" || item.title === "Packaging Material"}
                                                                />
                                                            </div>
                                                        ))}
                                                    </TableCell>
                                                    <ChildTableCell
                                                        className="w-[10%]"
                                                        key={22221}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        renderItem={(subchild) => (
                                                            <div className="flex flex-col min-h-16 justify-center">
                                                                <p className="font-semibold text-lg">{subchild['manufacturing_code']}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={2222}
                                                        className="w-[10%]"
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        renderItem={(subchild) => (
                                                            <div className="flex flex-col gap-4 min-h-16 justify-center">
                                                                <p className="font-semibold text-lg">{subchild['manufacturing_source']}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={Math.floor(Math.random() * 1000000) + 1}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        className="w-[24%]"
                                                        renderItem={(subchild) => (
                                                            <div className="flex flex-col gap-4 min-h-16 justify-center">
                                                                <p className="font-semibold text-lg">{subchild['address']} {subchild['submited_date'] ? "" : <span className="bg-green-400 p-1 rounded-md text-white">New</span>}</p>
                                                            </div>
                                                        )}
                                                    />
                                                    <ChildTableCell
                                                        key={Math.floor(Math.random() * 1000000) + 1}
                                                        items={child.subchild}
                                                        keyProp="id"
                                                        label="address"
                                                        className="w-[4%]"
                                                        renderItem={(subchild) => (
                                                            <div className="flex flex-col gap-4 min-h-16 justify-center">
                                                                <History key={subchild.id} className="w-4 h-4 cursor-pointer" onClick={() => {
                                                                    setIsOpenHistory({ isOpen: true, data: subchild.manufacturing_code })
                                                                }} />
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