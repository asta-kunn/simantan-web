import { Button } from "@/components/Dexain"
import { EDITABLE_ENUM } from "@/constants/technical-service.constant"
import techServiceStore from "@/stores/techServiceStore"
import { ArrowLeft, SendHorizontal, Save, Archive } from 'lucide-react'



export const FooterItemB = ({
    onSave, onSubmit, back, loading
}) => {
    const editable =  techServiceStore(state=>state.detailType)

    if(editable === EDITABLE_ENUM.NonEditable) {
        return (
            <div>
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
                <Button disabled={loading} onClick={() => { onSubmit('ARCHIVE') }} variant="outline" icon={<Archive className="h-4 w-4" />} iconPosition="left">
                    Skip Mapping
                </Button>
                <Button disabled={loading} onClick={() => { onSave() }} variant="outline" icon={<Save className="h-4 w-4" />} iconPosition="left">
                    Save
                </Button>
                <Button disabled={loading} onClick={() => { onSubmit('APPROVE') }} icon={<SendHorizontal className="h-4 w-4" />} iconPosition="right">
                    Submit
                </Button>
            </div>
        </div>
    )
}