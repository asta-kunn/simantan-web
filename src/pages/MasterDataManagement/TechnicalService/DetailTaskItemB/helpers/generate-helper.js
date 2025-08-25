const formatChecked = (manufacture) => {
    if (manufacture.IS_ACTIVE == "YES") {
        return true;
    } else {
        return false;
    }
}

const generateAddress = (manufacture) => {
    const arrayKey = [manufacture.ADDRESS_LINE1, manufacture.ADDRESS_LINE2, manufacture.POSTAL_CODE, manufacture.CITY, manufacture.COUNTRY]
    const modify_array = arrayKey.filter(item => item !== null && item !== '').join(",  ")
    if (modify_array) return modify_array;
    return '-'
}

const formatChildren = (data) => {
    return data.map((task) => {
        return {
            id: task.RAWMAT_ID,
            name: `${task.ITEM_RM_NUMBER} - ${task.ITEM_RM_DESC}`,
            item_rm_number: task.ITEM_RM_NUMBER,
            item_rm_id: task.ITEM_RM_ID,
            subchild: task.MANUFACTURER.map((manufacture) => {
                return {
                    id: manufacture.MANUF_ID,
                    manufacturing_source: manufacture.MANUF_NAME,
                    manufacturing_code: manufacture.MANUF_CODE,
                    address: generateAddress(manufacture),
                    isChecked: task.ITEM_RM_NUMBER.startsWith("E") || task.ITEM_RM_NUMBER.startsWith("B") ? true : formatChecked(manufacture),
                    submited_date: manufacture.SUBMITED_DATE,
                    isDisabled: task.ITEM_RM_NUMBER.startsWith("E") || task.ITEM_RM_NUMBER.startsWith("B")
                }
            })
        }
    })
}

export {formatChecked, generateAddress, formatChildren}