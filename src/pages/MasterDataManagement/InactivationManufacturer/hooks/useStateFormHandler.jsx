import { useState } from 'react'

const useStateFormHandler = () => {
    const [manufacturer, setManufacturer] = useState(null)
    const [itemMaterial, setItemMaterial] = useState(null)
    const [inactiveDate, setInactiveDate] = useState(null);

    return {
        manufacturer,
        setManufacturer,
        itemMaterial,
        setItemMaterial,
        inactiveDate,
        setInactiveDate
    }
}

export default useStateFormHandler
