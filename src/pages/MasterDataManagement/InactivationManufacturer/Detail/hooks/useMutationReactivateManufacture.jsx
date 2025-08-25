import { useMutation } from '@tanstack/react-query'
import { reactivateManufacturer } from '../services/index'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const useMutationReactivateManufacture = () => {
    const navigate = useNavigate();
    
    const { mutate: reactive } = useMutation({
        mutationFn: reactivateManufacturer,
        onSuccess: (response) => {  
            if(response?.success) {
                toast.success("Successfully reactivated manufacturer");
                let timeout = setTimeout(() => {
                    navigate(-1);
                }, 2000);
                return () => clearTimeout(timeout);
            }
        }
    })

    return{
        reactive
    }
}

export default useMutationReactivateManufacture
