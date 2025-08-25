import { Button } from '@/components/Dexain'
import ACTION_PLAN_ENUM from '@/pages/MasterDataManagement/TechnicalService/ListTask/constants/action-plan-enum'
import { ArrowLeft, SendHorizontal, Save } from 'lucide-react'
import React from 'react'

const TSFooterButton = ({ navigate, onSubmit, onSave, onProcess, back = false, detailActionPlan }) => {

    console.log(detailActionPlan, 'DETAIL ACTION PLAN')

    if (back) {
        return (
            <div className="flex flex-row items-center justify-between mt-8 p-4">
                <div>
                    <Button onClick={() => { navigate(-1) }} buttonStyle="outline">
                        <ArrowLeft size={18} /> <p className="text-lg">Back</p>
                    </Button>
                </div>
                <div>
                    {detailActionPlan === ACTION_PLAN_ENUM.WAITING_FOR_NIE && (
                        <Button onClick={onProcess} buttonStyle="gradient">
                            <p className="text-lg">Proccess</p> <SendHorizontal size={18} />
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-row items-center justify-between mt-8 p-4">
            <div>
                <Button onClick={() => { navigate(-1) }} buttonStyle="outline">
                    <ArrowLeft size={18} /> <p className="text-lg">Back</p>
                </Button>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
                <Button onClick={onSave} buttonStyle="outline">
                    <p className="text-lg">Save</p> <Save size={18} />
                </Button>
                <Button onClick={onSubmit} buttonStyle="gradient">
                    <p className="text-lg">Submit</p> <SendHorizontal size={18} />
                </Button>
                {/* <button onClick={onSubmit} className="border border-transparent bg-gradient-to-r from-[#D32F2F] to-[#7F1710] flex flex-row items-center justify-center gap-2 p-3 rounded-md text-white">
                    <p className="text-lg">Submit</p> <SendHorizontal size={18} />
                </button> */}
            </div>
        </div>
    )
}

export default TSFooterButton
