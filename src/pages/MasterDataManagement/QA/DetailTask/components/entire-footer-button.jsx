import { EDITABLE_ENUM } from '@/constants/technical-service.constant';
import authStore from '@/stores/authStore';
import techServiceStore from '@/stores/techServiceStore';
import { ArrowLeft, Check, X } from 'lucide-react'
import React, { memo } from 'react'
import STATUS_APPROVAL from '../constants/qa-approval-status';
import USER_TYPE from '@/constants/user-type.constant';

const TSFooterButton = memo(({ navigate, approve, reject, rejectedActive, status = STATUS_APPROVAL.SUBMITTED }) => {
    const detailType = techServiceStore((state) => state.detailType);
    const userTypeData = authStore(state => state.userTypeData)
    const token = authStore(state => state.user)


    if (detailType === EDITABLE_ENUM.NonEditable) {
        return (
            <div className="flex flex-row items-center justify-between mt-8 p-4">
                <button onClick={() => { navigate(-1) }} className="hover:bg-[#D32F2F] hover:text-white delay-50 transition border-2 font-semibold border-[#D32F2F] bg-white flex flex-row items-center justify-center gap-2 p-3 rounded-md text-[#D32F2F] ">
                    <ArrowLeft size={18} /> <p className="text-lg">Back</p>
                </button>
            </div>
        )
    }

    if (status === STATUS_APPROVAL.WAITING_FOR_APPROVAL && token.USER_TYPE === USER_TYPE.QA_OFFICER) {
        return (
            <div className="flex flex-row items-center justify-between mt-8 p-4">
                <button onClick={() => { navigate(-1) }} className="hover:bg-[#D32F2F] text-lg hover:text-white delay-50 transition border-2 font-semibold border-[#D32F2F] bg-white flex flex-row items-center justify-center gap-2 p-3 rounded-md text-[#D32F2F] ">
                    <ArrowLeft /> <p>Back</p>
                </button>
            </div>
        )
    }

    console.log(rejectedActive, 'Rejected Active')

    return (
        <div className="flex flex-row items-center justify-between mt-8 p-4">
            <button onClick={() => { navigate(-1) }} className="hover:bg-[#D32F2F] text-lg hover:text-white delay-50 transition border-2 font-semibold border-[#D32F2F] bg-white flex flex-row items-center justify-center gap-2 p-3 rounded-md text-[#D32F2F] ">
                <ArrowLeft /> <p>Back</p>
            </button>
            <div className="flex flex-row items-center justify-center gap-2">
                {!rejectedActive && (
                    <button onClick={approve} className=" border border-transparent bg-gradient-to-r from-[#D32F2F] to-[#7F1710] flex flex-row items-center justify-center gap-2 p-3 rounded-md text-white">
                        <Check size={18} /> <p className="text-lg">Approve</p>
                    </button>
                )}
                <button onClick={reject} className=" border border-transparent bg-gradient-to-r from-[#D32F2F] to-[#7F1710] flex flex-row items-center justify-center gap-2 p-3 rounded-md text-white">
                    <X size={18} /> <p className="text-lg">Reject</p>
                </button>
            </div>
        </div>
    )
})

export default TSFooterButton
