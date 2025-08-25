import { Button } from "@/components/Dexain"
import { ArrowLeft, SendHorizontal, X } from 'lucide-react'


export const FooterItemB = ({ 
    onSubmit, back, loading, isEditable
}) => {

    if (!isEditable) {
        return (
            <div className="p-8 flex items-center justify-between flex-row">
                <Button onClick={() => { back() }} variant="outline" icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
                    Back
                </Button>
            </div>
        )
    }


    return (
        <div className="p-4 flex items-center justify-between flex-row mt-[15vh]">
            <div>
                <Button onClick={() => { back() }} variant="outline" icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
                    Back
                </Button>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
                <Button disabled={loading} onClick={() => { onSubmit('REJECT') }} variant="outline" icon={<X className="h-4 w-4" />} iconPosition="left">
                    Reject
                </Button>
                <Button disabled={loading} onClick={() => { onSubmit('APPROVE') }} icon={<SendHorizontal className="h-4 w-4" />} iconPosition="right">
                    Approve
                </Button>
            </div>
        </div>
    )
}