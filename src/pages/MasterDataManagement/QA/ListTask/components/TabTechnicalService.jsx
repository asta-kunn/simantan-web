import { List, History } from 'lucide-react'

const TabTechnicalService = ({ tab, setTab }) => {
    return (
        <div className="flex items-center justify-between flex-row bg-white">
            <div className={`delay-100 transition flex items-center justify-center  w-1/2 gap-2 ${tab == "My Task" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`} onClick={() => { setTab("My Task") }}>
                <List size={15} /> <p className=" font-semibold text-md">My Task</p>
            </div>
            <div className={`delay-100 transition flex items-center justify-center w-1/2 gap-2 ${tab == "Task History" ? "text-[#B32017] border-b-2 border-[#B32017]" : "border-b-2"} py-2 cursor-pointer`} onClick={() => { setTab("Task History") }}>
                <History size={15} /> <p className="font-semibold text-md">Task History</p>
            </div>
        </div>
    )
}

export default TabTechnicalService
