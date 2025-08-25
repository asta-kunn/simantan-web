import { useMutation } from '@tanstack/react-query'
import { insertInactiveManufacture } from '../services'
import { toast } from 'sonner'
import NotificationSuccess from '@/pages/MasterDataManagement/ItemSubstitusi/EditTaskItem/components/notification-success'

const useInsertInactiveManufacture = ({ setLoading, setIsOpenDetail, setIsOpen, setManufacturer, setItemMaterial, setInactiveDate, setSelectedItemFG, refetch, setPagination }) => {
    
    const { mutate: saveData, isPending } = useMutation({
        mutationFn: (payload) => insertInactiveManufacture(payload),
        onSuccess: async (response) => {
            setTimeout(async () => {
                if (response.success) {
                    toast(<NotificationSuccess title="Successfully Inserted" description="The data has been inserted successfully." />, {
                        duration: 2000,
                        action: {
                            label: "Reload",
                            onClick: () => window.location.reload(),
                        },
                    });
                    setIsOpenDetail({ isOpen: false, item_fg: '' })
                    setIsOpen(false)
                    setManufacturer(null)
                    setItemMaterial(null)
                    setInactiveDate(null)
                    setSelectedItemFG('')
                    await refetch()
                    setPagination(prev => ({ ...prev, page: 1, total_page: 1 }))
                }
                setLoading(false)
            }, 1000)
        },
        onError: (error) => {
            console.log(error, 'ERROR')
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    })

    return {
        saveData,
        isPending
    }
}

export default useInsertInactiveManufacture
