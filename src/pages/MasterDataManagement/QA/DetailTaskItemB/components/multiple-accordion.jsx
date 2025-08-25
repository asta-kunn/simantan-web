

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
import { PencilLine, History } from 'lucide-react'


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


const NonIntermediateItemComponent = ({
    onChange,
    handleOpenSheet,
    rawmat,
    setIsOpenHistory
}) => {
    return (
        <AccordionContent>
            <div className="p-4">
                <Table>
                    <TableHeader className="bg-plm-grey text-base">
                        <TableRow>
                            <TableHead className="w-[12%]">Item No</TableHead>
                            <TableHead className="w-[6%]">Select</TableHead>
                            <TableHead className="w-[10%]">MFG Code</TableHead>
                            <TableHead className="w-[10%]">MFG Source</TableHead>
                            <TableHead className="w-[45%]">Address</TableHead>
                            <TableHead className="w-[10%]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-base">
                        {rawmat.children.map((child, parentId) => (
                            <TableRow key={parentId} >
                                <TableCell className="w-[12%]">{child.name}</TableCell>
                                <TableCell className="w-[8%]">
                                    {child.subchild.map((subchild, subchildIdx) => {
                                        return (
                                            <div className={`flex flex-col gap-4 ${generateWord(subchild['change_value']['address'])} justify-center`} key={`${subchild['change_value'].id} ${subchildIdx}`}>
                                                <Checkbox
                                                    name={`checkbox-${subchild['change_value'].id}`}
                                                    className="data-[state=checked]:bg-[#B32017]"
                                                    onCheckedChange={(checked) => {
                                                        onChange({
                                                            rawmatId: rawmat.id,
                                                            childId: child.id,
                                                            subChildId: subchildIdx,
                                                            checked: checked
                                                        });
                                                    }}
                                                    checked={subchild['change_value'].isChecked || false}
                                                />
                                            </div>
                                        )
                                    })}
                                </TableCell>
                                <ChildTableCell
                                    className="w-[10%]"
                                    key={randomInteger()}
                                    items={child.subchild}
                                    keyProp="id"
                                    label="address"
                                    renderItem={(subchild) => (
                                        <div className={`flex flex-col ${generateWord(subchild['change_value']['address'])} justify-center`}>
                                            <p className="font-semibold text-base">{subchild['change_value']['manufacturing_code'] ?? '-'}</p>
                                        </div>
                                    )}
                                />
                                <ChildTableCell
                                    key={randomInteger()}
                                    className="w-[20%]"
                                    items={child.subchild}
                                    keyProp="id"
                                    label="address"
                                    renderItem={(subchild) => (
                                        <div className={`flex flex-col gap-4 ${generateWord(subchild['change_value']['address'])} justify-center`}>
                                            <p className="font-semibold text-base">{subchild['change_value']['manufacturing_source'] ?? '-'}</p>
                                        </div>
                                    )}
                                />
                                <ChildTableCell
                                    key={randomInteger()}
                                    items={child.subchild}
                                    keyProp="id"
                                    label="address"
                                    className="min-w-[45%]"
                                    renderItem={(subchild) => (
                                        <div className={`flex flex-col gap-4 ${generateWord(subchild['change_value']['address'])} justify-center`}>
                                            <p className="font-semibold text-base">{subchild['change_value']['address'] ?? '-'}</p>
                                        </div>
                                    )}
                                />
                                <ChildTableCell
                                    key={randomInteger()}
                                    items={child.subchild}
                                    keyProp="id"
                                    label="edit"
                                    className="w-[5%]"
                                    renderItem={(subchild) => {
                                        return (
                                            <div className={`flex flex-col gap-4 ${generateWord(subchild['change_value']['address'])} justify-center`}>
                                                <div className="flex flex-row gap-4">
                                                    {subchild['change_value']['manufacturing_code'] && (
                                                        <PencilLine className="w-4 h-4 cursor-pointer" onClick={() => {
                                                            handleOpenSheet({
                                                                value: {
                                                                    current_value: { ...subchild['stick_value'] },
                                                                    update_value: { ...subchild['change_value'] }
                                                                },
                                                                childId: child.id,
                                                                rawmatId: rawmat.id,
                                                                subchildId: subchild['change_value'].id
                                                            })
                                                        }} />
                                                    )}
                                                    <History className="w-4 h-4 cursor-pointer" onClick={() => {
                                                        setIsOpenHistory({ isOpen: true, data: subchild['stick_value'].manufacturing_code })
                                                    }} />
                                                </div>

                                            </div>
                                        )
                                    }}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AccordionContent>
    )
}

const MultipleAccordion = ({ rawmatList, onChange, handleOpenSheet, setIsOpenHistory }) => {

    if (!rawmatList) return null;

    if (!rawmatList.length) {
        return null
    }

    return (
        <Accordion type="multiple" defaultValue={[]} collapsible="true" className="w-full">
            {rawmatList.map((rawmat) => {
                return (
                    <AccordionItem value={rawmat.id} className="my-2 " key={rawmat.id}>
                        <AccordionTrigger className={`px-4 py-3 hover:bg-gray-50 rounded-md w-full`}>
                            <span className="font-medium text-base font-semibold">{rawmat.title}</span>
                        </AccordionTrigger>
                        {
                            <NonIntermediateItemComponent
                                onChange={onChange}
                                rawmat={rawmat}
                                handleOpenSheet={handleOpenSheet}
                                setIsOpenHistory={setIsOpenHistory}
                            />
                        }
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

export default MultipleAccordion
