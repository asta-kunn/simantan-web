import { Fragment } from "react";
import MultipleAccordion from "./multiple-accordion";



const TableAccordionItemB = ({
    rawmatList,
    onChange,
    dataVersion,
    file,
    title,
    editable = false,
    setIntermediateItemId
}) => {
    return (
        <Fragment>
            <MultipleAccordion rawmatList={rawmatList} onChange={onChange} dataVersion={dataVersion} file={file} title={title} editable={editable} setIntermediateItemId={setIntermediateItemId} />
        </Fragment>
    )
};

export default TableAccordionItemB;