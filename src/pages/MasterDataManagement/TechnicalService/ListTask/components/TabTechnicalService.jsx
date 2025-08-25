import { List, History } from 'lucide-react'
import React,{useState} from 'react'

const initialValue = "My Task"

const TabTechnicalService = ({tab,setTab}) => {

    return (
        <div className="flex items-center justify-between flex-row bg-white">
            <div className={`delay-100 transition flex items-center justify-center  w-1/2 gap-2 ${tab == "My Task" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`} onClick={() => {setTab("My Task")}}>
                <List className="h-4 w-4"/> <p className=" font-semibold text-lg">My Task</p>
            </div>
            <div className={`delay-100 transition flex items-center justify-center w-1/2 gap-2 ${tab == "Task History" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`} onClick={() => {setTab("Task History")}}>
                <History className="h-4 w-4"/> <p className="font-semibold text-lg">Task History</p>
            </div>
        </div>
    )
}

export default TabTechnicalService
