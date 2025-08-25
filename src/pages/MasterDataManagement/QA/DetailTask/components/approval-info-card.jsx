import React from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card"; // Pastikan path import sesuai setup Shadcn Anda
import { Check, X } from 'lucide-react';
import STATUS_APPROVAL from '../constants/qa-approval-status';
import { formatTime } from '@/lib/utils';


export function ApprovalInfoCard({ approval }) {


    const renderStatusApprove = ({ filledBy }) => (
        <div className="space-y-1">
            <div className='flex items-center gap-1'>
                <div className="flex items-center gap-2 bg-green-600 w-max rounded-full p-2">
                    <Check size={18} className='text-white' />
                </div>
            </div>
            <p className="text-lg font-semibold text-foreground">
                Approved
            </p>
            <p className="text-base text-muted-foreground">
                {formatTime(filledBy.ACTION_DATE)}
            </p>
            <p className="text-sm text-foreground">
                {filledBy.SUBMITTER_NAME} <span className="text-plm-rose">({filledBy.SUBMITTER_EMAIL})</span>
            </p>
            <p className="text-sm text-muted-foreground">
                {filledBy.role}
            </p>

            <div className="space-y-1 md:col-span-1 bg-stone-100 p-2">
                <p className="text-sm font-semibold text-foreground">
                    Remarks
                </p>
                <p className="text-sm text-muted-foreground">
                    {filledBy.NOTES ? filledBy.NOTES : '-'}
                </p>
            </div>
        </div>
    )

    const renderStatusWaitingApproval = ({ filledBy }) => (
        <div className="space-y-1">
            <div className='flex items-center gap-1'>
                <div className="flex items-center gap-2 bg-stone-300 w-max rounded-full p-2">
                    <X size={18} className='text-stone-300' />
                </div>
            </div>
            <p className="text-lg font-semibold text-foreground text-stone-300">
                Waiting For Approval
            </p>
            <p className="text-sm text-foreground">
                {filledBy.SUBMITTER_NAME} <span className="text-plm-rose">({filledBy.SUBMITTER_EMAIL})</span>
            </p>
            <p className="text-sm text-muted-foreground">
                {filledBy.role}
            </p>
        </div>
    )

    const renderStatusRejected = ({ filledBy }) => (
        <div className="space-y-1">
            <div className='flex items-center gap-1'>
                <div className="flex items-center gap-2 bg-plm-rose w-max rounded-full p-2">
                    <X size={18} className='text-white' />
                </div>
            </div>
            <p className="text-lg font-semibold text-foreground">
                Rejected
            </p>
            <p className="text-base text-muted-foreground">
                {formatTime(filledBy.ACTION_DATE)}
            </p>
            <p className="text-sm text-foreground">
                {filledBy.SUBMITTER_NAME} <span className="text-plm-rose">({filledBy.SUBMITTER_EMAIL})</span>
            </p>
            <p className="text-sm text-muted-foreground">
                {filledBy.role}
            </p>

            <div className="space-y-1 md:col-span-1 bg-stone-100 p-2">
                <p className="text-sm font-semibold text-foreground">
                    Remarks
                </p>
                <p className="text-sm text-muted-foreground">
                    {filledBy.NOTES ? filledBy.NOTES : '-'}
                </p>
            </div>
        </div>
    )

    const renderStatusSubmited = ({ filledBy }) => (
        <div className="space-y-1">
            <div className='flex items-center gap-1'>
                <div className="flex items-center gap-2 bg-green-600 w-max rounded-full p-2">
                    <Check size={18} className='text-white' />
                </div>
            </div>
            <p className="text-lg font-semibold text-foreground">
                Submitted by
            </p>
            <p className="text-base text-muted-foreground">
                {formatTime(filledBy.ACTION_DATE)}
            </p>
            <p className="text-sm text-foreground">
                {filledBy.SUBMITTER_NAME} <span className="text-plm-rose">({filledBy.SUBMITTER_EMAIL})</span>
            </p>
            <p className="text-sm text-muted-foreground">
                {filledBy.role}
            </p>

            <div className="space-y-1 md:col-span-1 bg-stone-100 p-2">
                <p className="text-sm font-semibold text-foreground">
                    Remarks
                </p>
                <p className="text-sm text-muted-foreground">
                    {filledBy.NOTES ? filledBy.NOTES : '-'}
                </p>
            </div>
        </div>
    )

    const renderStatusProceed = ({ filledBy }) => (
        <div className="space-y-1">
            <div className='flex items-center gap-1'>
                <div className="flex items-center gap-2 bg-green-600 w-max rounded-full p-2">
                    <Check size={18} className='text-white' />
                </div>
            </div>
            <p className="text-lg font-semibold text-foreground">
                Processed By
            </p>
            <p className="text-base text-muted-foreground">
                {formatTime(filledBy.ACTION_DATE)}
            </p>
            <p className="text-sm text-foreground">
                {filledBy.SUBMITTER_NAME} <span className="text-plm-rose">({filledBy.SUBMITTER_EMAIL})</span>
            </p>
            <p className="text-sm text-muted-foreground">
                {filledBy.role}
            </p>

            <div className="space-y-1 md:col-span-1 bg-stone-100 p-2">
                <p className="text-sm font-semibold text-foreground">
                    Remarks
                </p>
                <p className="text-sm text-muted-foreground">
                    {filledBy.NOTES ? filledBy.NOTES : '-'}
                </p>
            </div>
        </div>
    )

    const renderComponentApproval = ({ filledBy }) => {
        if (filledBy.ACTION === STATUS_APPROVAL.APPROVED) {
            return renderStatusApprove({ filledBy })
        } else if (filledBy.ACTION === STATUS_APPROVAL.WAITING_FOR_APPROVAL) {
            return renderStatusWaitingApproval({ filledBy })
        } else if (filledBy.ACTION === STATUS_APPROVAL.REJECT) {
            return renderStatusRejected({ filledBy })
        } else if (filledBy.ACTION === STATUS_APPROVAL.PROCEED) {
            return renderStatusProceed({ filledBy })
        } else {
            return renderStatusSubmited({ filledBy })
        }
    }

    const componentMapping = ({ filledBy, index }) => (
        <div className="min-w-[350px] mx-2 p-4 rounded-md text-white" key={index}>
            {renderComponentApproval({ filledBy })}
        </div>
    )

    if (!approval || approval.length === 0) return null

    return (
        <Card className="w-full p-0">
            <div className='bg-stone-600 text-white p-1 w-max rounded-tl-lg rounded-br-lg px-2 '>
                <p className='text-sm font-semibold'>Approval Information</p>
            </div>
            <CardContent className='p-4 overflow-x-auto'>
                <div className='flex flex-row items-start w-max'>
                    {approval.map((item, index) => {
                        return componentMapping({ filledBy: item, index })
                    })}
                </div>
            </CardContent>
        </Card>
    );
}