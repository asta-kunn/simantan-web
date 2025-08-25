import { Stepper } from "@/components/common/Stepper";
import { formatTime } from "@/lib/utils";
import authStore from "@/stores/authStore";
import { CheckIcon, XIcon, Clock } from "lucide-react";
import { Fragment, useEffect, useState } from "react";


const BoxApproval = ({
    name,
    email,
    role,
    action_date,
    notes
}) => {
    return (
        <div className="flex flex-col">
            <div>{name} - {role}</div>
            <div className="text-sm text-primary-normal font-medium">{email}</div>
            {
                action_date && (
                    <Fragment>
                        <div className="py-1">{formatTime(new Date(action_date))}</div>
                        {
                            notes && (
                                <div className="bg-slate-100 text-black px-2 py-1 rounded-sm flex items-start justify-start text-justify min-h-12">{notes}</div>
                            )
                        }
                    </Fragment>
                )
            }
        </div>
    )
}

const conditionIcon = (status) => {
    if (status === 'APPROVE') return CheckIcon;
    if (status === 'SUBMIT') return CheckIcon;
    if (status === 'REJECT') return XIcon;
    if (status === 'WAITING APPROVAL') return Clock;
    return Clock;
}

const conditionState = (status) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'SUBMIT') return 'success';
    if (status === 'REJECT') return 'error';
    if (status === 'WAITING APPROVAL') return 'disable';
    return 'disable';
}

const conditionTitle = (status) => {
    if (status === 'APPROVED') return 'Approved';
    if (status === 'SUBMIT') return 'Submitted';
    if (status === 'REJECT') return 'Rejected';
    if (status === 'WAITING APPROVAL') return 'Waiting Approval';
    return 'Waiting Approval';
}


const ApprovalHistory = ({ dataApproval }) => {
    const user = authStore(state => state.user)

    const [approval, setApproval] = useState([
        {
            icon: Clock,
            state: 'disable',
            title: 'Waiting Approval',
            description: <BoxApproval action='WAITING APPROVAL' name={user.NAME} email={user.EMAIL} role={user.DEPARTMENT_CODE} />
        }
    ])

    useEffect(() => {
        if (dataApproval.length > 0) {
            setApproval(dataApproval.map((item) => {
                return {
                    icon: conditionIcon(item.ACTION_PLAN),
                    state: conditionState(item.ACTION_PLAN),
                    title: conditionTitle(item.ACTION_PLAN),
                    description: <BoxApproval action={item.ACTION_PLAN} name={item.APPROVAL_NAME} email={item.APPROVAL_EMAIL} role={item.APPROVAL_ROLE} action_date={item.APPROVE_DATE} notes={item.NOTES} />
                }
            }))
        }
    }, [dataApproval])


    if (!dataApproval) return null;

    return (
        <div>
            <Stepper orientation="vertical" stepItem={approval} />
        </div>
    )
}

export default ApprovalHistory
