import { useQuery } from '@tanstack/react-query'
import { fetchItemFGOption } from '../services'
import { useState } from 'react'

const useFetchItemFGOption = () => {
    const [itemFGOption, setItemFGOption] = useState([])
    const { isLoading, error } = useQuery({
        queryKey: ['item-fg-option'],
        queryFn: () => fetchItemFGOption(),
        onSuccess: (result) => {
            setItemFGOption(result.data.map((item) => {
                return {
                    label: `${item.ITEM_FG_NUMBER} - ${item.ITEM_FG_DESC}`,
                    value: `${item.ITEM_FG_NUMBER} - ${item.ITEM_FG_DESC} - ${item.AVL_FORMULA_VERSION}`
                }
            }))
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return { itemFGOption, isLoading, error }
}

export default useFetchItemFGOption
