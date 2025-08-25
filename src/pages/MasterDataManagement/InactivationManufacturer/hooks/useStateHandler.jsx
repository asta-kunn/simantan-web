import { useState } from 'react'
import techServiceStore from '@/stores/techServiceStore'
import authStore from '@/stores/authStore'

const initialFilterForm = {
    search_by: "",
    search_value: "",
}

const initialIsOpenDetail = {
    isOpen: false,
    item_fg: ''
}


const useStateHandler = () => {
    const [filterForm, setFilterForm] = useState(initialFilterForm)
    const [tabValue, setTabValue] = useState("In Progress")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItemFG, setSelectedItemFG] = useState("")
    const [isOpenDetail, setIsOpenDetail] = useState(initialIsOpenDetail);
    const [loading, setLoading] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
        notes: ''
    })
    const [isOpenValidateLogin, setIsOpenValidateLogin] = useState(false)
    const detailTask = techServiceStore(state => state.detailTask)
    const setDetailTask = techServiceStore(state => state.setDetailTask)
    const user = authStore(state => state.user)

    return {
        filterForm,
        setFilterForm,
        tabValue,
        setTabValue,
        isOpen,
        setIsOpen,
        selectedItemFG,
        setSelectedItemFG,
        isOpenDetail,
        setIsOpenDetail,
        loading,
        setLoading,
        detailTask,
        setDetailTask,
        user,
        isOpenValidateLogin,
        setIsOpenValidateLogin,
        loginForm,
        setLoginForm
    }
}

export default useStateHandler
