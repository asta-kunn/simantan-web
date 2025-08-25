import { motion } from 'framer-motion'
import { Button } from '@/components/Dexain'
import { ArrowLeftIcon, XIcon, CheckIcon } from 'lucide-react'
import { statusItemSubstitution } from '../constants/status-item-submission'
import { userRole } from '@/constants/role.constant'



const FooterApprovalTaskItem = ({ handleApprove, navigate, user, status, handleReject }) => {

    const isSCMManager = user.ROLE_CODE === userRole.DSP_MANAGER;
    const isQAOfficer = user.ROLE_CODE === userRole.QA_OFFICER;
    const isQAManager = user.ROLE_CODE === userRole.QA_MANAGER;

    const sectionApprove = () => (
        <div className="flex flex-row gap-2 items-start justify-start">
            <Button variant="outline" onClick={handleReject}>
                <XIcon />
                <p>Reject</p>
            </Button>
            <Button onClick={handleApprove}>
                <CheckIcon />
                <p>Approve</p>
            </Button>
        </div>
    )

    const handlerAccessApproveReject = () => {
        switch (true) {
            case isSCMManager && status === statusItemSubstitution.WAITING_FOR_MANAGER:
                return sectionApprove();
            case isQAOfficer && status === statusItemSubstitution.WAITING_FOR_QA_OFFICER:
                return sectionApprove();
            case isQAManager && status === statusItemSubstitution.WAITING_FOR_QA_MANAGER:
                return sectionApprove();
            default:
                return null;
        }
    }


    // if (isQAManager && status === statusItemSubstitution.WAITING_FOR_MANAGER) { }


    return (
        <motion.div
            className="flex flex-row gap-2 my-4 items-start justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="flex flex-row gap-2 items-start justify-between w-full">
                <Button variant="outline" onClick={() => { navigate(-1) }}>
                    <ArrowLeftIcon />
                    <p>Back</p>
                </Button>
                {handlerAccessApproveReject()}
            </div>

        </motion.div>
    )
}

export default FooterApprovalTaskItem
