import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRequestInactiveSchema from "../schema/request-inactive.schema";

const useActionHandler = ({
    filterForm,
    setFilterForm,
    setIsOpen,
    setIsOpenDetail,
    setManufacturer,
    setRawmatOptions,
    rawMaterial,
    setItemMaterial,
    setInactiveDate,
    manufacturer,
    selectedItemFG,
    itemMaterial,
    inactiveDate,
    saveData,
    setLoading,
    setDetailTask
}) => {
    const navigate = useNavigate();

    const handleInsert = async () => {
        setLoading(true)
        try {
            const payload = {
                MANUFACTURE_CODE: manufacturer.split(" - ")[0],
                MANUFACTURE_NAME: manufacturer.split(" - ")[1],
                ITEM_FG_NUMBER: selectedItemFG.split(" - ")[0],
                ITEM_FG_DESCRIPTION: selectedItemFG.split(" - ")[1],
                ITEM_RM_NUMBER: itemMaterial.split(" - ")[0],
                ITEM_RM_DESCRIPTION: itemMaterial.split(" - ")[1],
                AVL_VERSION: selectedItemFG.split(" - ")[2],
                MANUFACTURING_SITE: "DEXA MEDICA, PT",
                EFFECTIVE_DATE: inactiveDate,
            }

            await saveData(payload);

            setManufacturer(null)
            setItemMaterial(null)
            setInactiveDate(null)

        } catch (error) {
            console.error(error, 'ERROR')
            setManufacturer(null)
            setItemMaterial(null)
            setInactiveDate(null)
        }
    }
    
    const { control, setValue, errors, onSubmit, reset, handleSubmitSchema } = useRequestInactiveSchema({ manufacturer, itemMaterial, inactiveDate, handleInsert });

    const searchSubmit = useCallback(async (value, source) => {
        try {
            setFilterForm({
                ...filterForm,
                search_by: source,
                search_value: value
            });
        } catch (error) {
            console.log(error, 'ERROR')
        }
    }, [filterForm, setFilterForm]);

    const handleAddManufacturer = () => {
        setIsOpen(prev => !prev)
        reset({
            manufacturer: '',
            itemMaterial: '',
            inactiveDate: ''
        })
    }

    const handleSubmit = useCallback(async (value) => {
        setIsOpenDetail(value)
    }, [setIsOpenDetail])

    const handleChangeManufacturer = useCallback(async (value) => {
        const get_manuf_code = value.split(' - ')[0]
        setManufacturer(value)
        const find_data = rawMaterial.find((item) => item.MANUFACTURE_CODE === get_manuf_code)
        setRawmatOptions(find_data.ITEM_RM_LIST.map((item) => {
            return {
                label: `${item.ITEM_RM_NUMBER} - ${item.ITEM_RM_DESC}`,
                value: `${item.ITEM_RM_NUMBER} - ${item.ITEM_RM_DESC} - ${item.ITEM_RM_ID}`
            }
        }))
    }, [setManufacturer, rawMaterial, setRawmatOptions])

    const handleChangeFG = useCallback(() => {
        setIsOpenDetail({
            isOpen: false,
        })
        setIsOpen(true)
        setItemMaterial(null)
        setManufacturer(null)
        setInactiveDate(null)
    }, [setIsOpenDetail, setIsOpen, setItemMaterial, setManufacturer, setInactiveDate])

  

    const onView = useCallback((id) => {
        console.log(id, 'ID')
        navigate(`/master-data-management/inactive-manufacture-list/detail`)
        setDetailTask(id)
    }, [])

    return {
        searchSubmit,
        handleAddManufacturer,
        handleSubmit,
        handleChangeManufacturer,
        handleChangeFG,
        handleInsert,
        onView,
        control,
        setValue,
        errors,
        onSubmit,
        reset,
        handleSubmitSchema
    }
}

export default useActionHandler
