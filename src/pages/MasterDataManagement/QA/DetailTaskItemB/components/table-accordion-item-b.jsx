import { Fragment } from "react";
import MultipleAccordion from "@/pages/MasterDataManagement/TechnicalService/DetailTaskItemB/components/multiple-accordion";



const TableAccordionItemB = ({
    rawmatList,
    onChange,
    handleOpenSheet,
    setIsOpenHistory,
    title,
    dataVersion,
    editable
}) => {
    return (
        <Fragment>
            <MultipleAccordion 
                rawmatList={rawmatList.map((item) => {
                    return {
                        ...item,
                        children: item.children.map((child) => {
                            return {
                                ...child,
                                subchild: child['subchild'].map((item) => item['change_value'])
                            }
                        })
                    }
                })}
                currentList={rawmatList.map((item) => {
                    return {
                        ...item,
                        children: item.children.map((child) => {
                            return {
                                ...child,
                                subchild: child['subchild'].map((item) => item['stick_value'])
                            }
                        })
                    }
                })}
                setIsOpenHistory={setIsOpenHistory} 
                onChange={onChange} 
                handleOpenSheet={handleOpenSheet} 
                title={title} 
                dataVersion={dataVersion} 
                editable={editable} 
             />
        </Fragment>
    )
};

export default TableAccordionItemB;