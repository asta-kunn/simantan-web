import { useQuery } from '@tanstack/react-query'
import { fetchDetailInactiveManufacture } from '../services'
import { useState } from 'react'

const useFetchDetailInactiveManufacture = (item_fg) => {
    const [detailItemA, setdetailItemA] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [rawMaterial, setRawMaterial] = useState(null);
    const [rawmatOptions, setRawmatOptions] = useState(null);

    const { refetch } = useQuery({
        queryKey: ['detail-inactive-manufacture', item_fg],
        queryFn: () => fetchDetailInactiveManufacture(item_fg),
        onSuccess: (response) => {
            setdetailItemA({
                ITEM_FG_NUMBER: response.data.ITEM_FG_NUMBER,
                ITEM_FG_DESC: response.data.ITEM_FG_DESC,
                ORA_RECIPE_VERSION: response.data.ORA_RECIPE_VERSION,
                ORA_FORMULA_VERSION: response.data.ORA_FORMULA_VERSION,
                AVL_FORMULA_VERSION: response.data.AVL_FORMULA_VERSION
            });
            setManufacturer(response.data.MANUFACTURER_LIST.map((manufacture) => {
                return {
                    label: `${manufacture.MANUF_CODE} - ${manufacture.MANUF_NAME}`,
                    value: `${manufacture.MANUF_CODE} - ${manufacture.MANUF_NAME} - ${manufacture.MANUF_ID}`
                }
            }));
            setRawMaterial(response.data.MANUFACTURER_LIST.map((manufacture) => {
                return {
                    MANUFACTURE_CODE: manufacture.MANUF_CODE,
                    ITEM_RM_LIST: manufacture.ITEM_RM_LIST.map((item) => {
                        return {
                            ...item,
                        }
                    })
                }
            }));
        },
        enabled: !!item_fg
    })

    return {
        refetch,
        detailItemA,
        manufactureList: manufacturer,
        rawMaterial,
        rawmatOptions,
        setRawmatOptions
    }
}

export default useFetchDetailInactiveManufacture
