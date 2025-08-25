const generateAddress = (manufacture) => {
    const arrayKey = [manufacture.ADDRESS_LINE1, manufacture.ADDRESS_LINE2, manufacture.POSTAL_CODE, manufacture.CITY, manufacture.COUNTRY]
    const modify_array = arrayKey.filter(item => item !== null && item !== '').join(",  ")
    if (modify_array) return modify_array;
    return '-'
}

const formatChecked = (manufacture) => {
    if (manufacture.IS_ACTIVE == "YES") {
        return true;
    } else {
        return false;
    }
}

const formatChildren = ({ data, setRejectedActive }) => {
    return data.map((task) => {
        return {
            id: task.RAWMAT_ID,
            name: `${task.ITEM_RM_NUMBER} - ${task.ITEM_RM_DESC}`,
            item_rm_number: task.ITEM_RM_NUMBER,
            item_rm_id: task.ITEM_RM_ID,
            manufacturing_site: task.MANUFACTURING_SITE,
            subchild: task.MANUFACTURER.map((manufacture) => {
                if (!manufacture.SUBMITED_DATE) {
                    setRejectedActive(true)
                }
                return {
                    stick_value: {
                        id: manufacture.MANUF_ID,
                        manufacturing_source: manufacture.MANUF_NAME,
                        manufacturing_code: manufacture.MANUF_CODE,
                        address: generateAddress(manufacture),
                        address_line1: manufacture.ADDRESS_LINE1 ?? "",
                        address_line2: manufacture.ADDRESS_LINE2 ?? "",
                        postal_code: manufacture.POSTAL_CODE ?? "",
                        city: manufacture.CITY ?? "",
                        country: manufacture.COUNTRY ?? "",
                        isChecked: task.ITEM_RM_NUMBER.startsWith("B") ? true : manufacture.IS_ACTIVE == "YES" ? true : false,
                        isDisabled: true
                    },
                    change_value: {
                        id: manufacture.MANUF_ID,
                        manufacturing_source: manufacture.MANUF_NAME,
                        manufacturing_code: manufacture.MANUF_CODE,
                        address: generateAddress(manufacture),
                        address_line1: manufacture.ADDRESS_LINE1 ?? "",
                        address_line2: manufacture.ADDRESS_LINE2 ?? "",
                        postal_code: manufacture.POSTAL_CODE ?? "",
                        city: manufacture.CITY ?? "",
                        country: manufacture.COUNTRY ?? "",
                        isChecked: task.ITEM_RM_NUMBER.startsWith("B") ? true : manufacture.IS_ACTIVE == "YES" ? true : false,
                        isUpdated: false,
                        isDisabled: true
                    }
                }
            })
        }
    })
}

const formatChildrenView = ({ data }) => {
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
                    isDisabled: true
                }
            })
        }
    })
}

export { formatChildren, formatChildrenView, generateAddress, formatChecked }