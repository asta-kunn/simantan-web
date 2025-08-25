import { List, History } from 'lucide-react'

const TabApprovalList = ({tab,setTab}) => {
    return (
        <div className="flex items-center justify-between flex-row bg-white">
            <div className={`delay-100 transition flex items-center justify-center  w-1/2 gap-2 ${tab == "Approval Task" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`} 
            onClick={() => {setTab("Approval Task")}}>
                <List size={20} /> <p className=" font-semibold text-md">Approval Task</p>
            </div>
            <div className={`delay-100 transition flex items-center justify-center w-1/2 gap-2 ${tab == "Approval History" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`}
             onClick={() => {setTab("Approval History")}}>
                <History size={20} /> <p className="font-semibold text-md">Approval History</p>
            </div>
        </div>
    )
}

export default TabApprovalList