

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
import ChildTableCell from "@/pages/MasterDataManagement/QA/DetailTask/components/child-table-cell";
import { randomInteger } from "../helpers/random-int";
import { Checkbox } from "@/components/Dexain";
import { History, PencilLine } from "lucide-react";


const generateWord = (char) => {
    if (char.length < 50) {
        return "min-h-16"
    } else if (char.length < 100) {
        return "min-h-24"
    } else if (char.length < 150) {
        return "min-h-28"
    }

    return "min-h-28"
}

const EmptyData = () => {
    return (
        <TableBody className="text-md">
            <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-stone-400">There is no data</TableCell>
            </TableRow>
        </TableBody>
    )
}

const generateCell = (rawmat, child, setIntermediateItemId) => {
    if (rawmat.title === 'INTERMEDIATE MATERIALS') {
        return <TableCell className="w-[12%] text-blue-600 font-medium underline cursor-pointer" onClick={() => { 
            setIntermediateItemId(child.name.split(' - ')[0])
        }}>{child.name} {child.subchild.some(item => item.manufacturing_code === null) && (<span className="!text-rose-500">*</span>)}</TableCell>
    }
    return <TableCell className="w-[12%]" >{child.name}</TableCell>
}

const FilledData = ({ rawmat, onChange, editable, handleOpenSheet, setIsOpenHistory, currentList, setIntermediateItemId }) => {
    return (
        <TableBody className="text-md">
            {rawmat.children.map((child, parentId) => (
                <TableRow key={parentId} >
                    {generateCell(rawmat, child, setIntermediateItemId)}
                    <TableCell className="w-[6%]">
                        {child.subchild.map((subchild, subchildIdx) => (
                            <div className={`flex flex-col gap-4 ${generateWord(subchild['address'])} justify-center`} key={`${subchild.id} ${subchildIdx}`}>
                                <Checkbox
                                    name={`checkbox-${subchild.id}`}
                                    className="data-[state=checked]:bg-[#B32017]"
                                    onCheckedChange={(checked) => {
                                        onChange({
                                            rawmatId: rawmat.id,
                                            childId: child.id,
                                            subChildId: subchildIdx,
                                            checked: checked
                                        });
                                    }}
                                    checked={subchild.isChecked || false}
                                    disabled={subchild.isDisabled}
                                />
                            </div>
                        ))}
                    </TableCell>
                    <ChildTableCell
                        className="w-[10%]"
                        key={randomInteger()}
                        items={child.subchild}
                        keyProp="id"
                        label="address"
                        renderItem={(subchild) => (
                            <div className={`flex flex-col ${generateWord(subchild['address'])} justify-center`}>
                                <p className="font-medium text-md">{subchild['manufacturing_code'] ?? '-'}</p>
                            </div>
                        )}
                    />
                    <ChildTableCell
                        key={randomInteger()}
                        className="w-[10%]"
                        items={child.subchild}
                        keyProp="id"
                        label="address"
                        renderItem={(subchild) => (
                            <div className={`flex flex-col gap-4 ${generateWord(subchild['address'])} justify-center`}>
                                <p className="font-medium text-md">{subchild['manufacturing_source'] ?? '-'}</p>
                            </div>
                        )}
                    />
                    <ChildTableCell
                        key={randomInteger()}
                        items={child.subchild}
                        keyProp="id"
                        label="address"
                        className="w-[24%]"
                        renderItem={(subchild) => (
                            <div className={`flex flex-col gap-4 ${generateWord(subchild['address'])} justify-center`}>
                                <p className="font-medium text-md">{subchild['address']}</p>
                            </div>
                        )}
                    />
                    {
                        editable && (
                            <ChildTableCell
                                key={randomInteger()}
                                items={child.subchild}
                                keyProp="id"
                                label="address"
                                className="w-[4%]"
                                renderItem={(subchild) => (
                                    <div className={`flex flex-col gap-4 ${generateWord(subchild['address'])} justify-center`}>
                                        <div className="flex flex-row gap-4">
                                            {subchild['manufacturing_code'] && (
                                                <PencilLine className="w-4 h-4 cursor-pointer" onClick={() => {
                                                    console.log(currentList, 'CURRENT LIST')
                                                    console.log(subchild, 'SUBCHILD')
                                                    handleOpenSheet({
                                                        value: {
                                                            current_value: { ...subchild },
                                                            update_value: { ...subchild }
                                                        },
                                                        childId: child.id,
                                                        rawmatId: rawmat.id,
                                                        subchildId: subchild.id
                                                    })
                                                }} />
                                            )}
                                            <History className="w-4 h-4 cursor-pointer" onClick={() => {
                                                setIsOpenHistory({ isOpen: true, data: subchild.manufacturing_code })
                                            }} />
                                        </div>
                                    </div>
                                )}
                            />
                        )
                    }
                </TableRow>
            ))}
        </TableBody>
    )
}

const MultipleAccordion = ({ rawmatList, onChange, dataVersion, file, title, editable, handleOpenSheet, setIsOpenHistory, setIntermediateItemId }) => {

    if (!rawmatList) return null;

    if (!rawmatList.length) {
        return null
    }

    return (
        <div className="w-full">
            {
                title.segment === 'A' && (
                    <div className="space-y-4">
                        <div className="mb-6 border-b border-stone-200">
                            <div className="bg-[#F2F5F9] flex flex-row items-center justify-center w-full gap-6 py-2">
                                {dataVersion.map((item) => {
                                    return <p className="w-1/5 text-center font-semibold text-md" key={item.id}>{item.title}</p>
                                })}
                            </div>
                            <div className="flex flex-row items-center justify-center w-full gap-6 py-2">
                                {dataVersion.map((item) => {
                                    if (item.title === "MA Number And Version") {
                                        return <a target="_blank" href={`https://portal21.dexagroup.com/dss/component_services/plm_nie/upload/local/${file}`} className="w-1/5 text-center font-medium text-md" key={item.id}>{item.value}</a>
                                    }
                                    return <p className="w-1/5 text-center font-medium text-md" key={item.id}>{item.value}</p>
                                })}
                            </div>
                        </div>
                    </div>
                )
            }
            <Accordion type="multiple" defaultValue={[]} collapsible="true" className="w-full">
                {rawmatList.map((rawmat) => {
                    return (
                        <AccordionItem value={rawmat.id} className="my-2" key={rawmat.id}>
                            <AccordionTrigger className={`px-4 py-3 hover:bg-gray-50 rounded-md w-full`}>
                                <span className="font-medium text-md">{rawmat.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4">
                                    <Table>
                                        <TableHeader className="bg-plm-grey text-md">
                                            <TableRow>
                                                <TableHead>Item No</TableHead>
                                                <TableHead>Select</TableHead>
                                                <TableHead>MFG Code</TableHead>
                                                <TableHead>MFG Source</TableHead>
                                                <TableHead>Address</TableHead>
                                                {editable && <TableHead>Action</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        {rawmat.children.length > 0 ? <FilledData rawmat={rawmat} onChange={onChange}
                                            editable={editable} handleOpenSheet={handleOpenSheet} setIsOpenHistory={setIsOpenHistory} setIntermediateItemId={setIntermediateItemId} />
                                            : <EmptyData />}
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

export default MultipleAccordion
