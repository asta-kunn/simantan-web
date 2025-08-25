import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EllipsisVertical, HistoryIcon, AlarmClockCheck } from 'lucide-react'

const PopupSection = ({ detailItemB, handleOpenSheet, handleOpenTableHistory }) => {
    return (
        <div className="flex items-center flex-row gap-4">
            <div>
                <h1 className="text-lg font-semibold">{detailItemB && detailItemB['ACTION_PLAN']}</h1>
            </div>
            <Popover>
                <PopoverTrigger>
                    <div>
                        <EllipsisVertical size={20} className="text-[#B32017] hover:text-[#B32017]/80 cursor-pointer" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-36 p-2">
                    <div className="flex flex-col gap-1">
                        <button onClick={handleOpenSheet} className="text-left px-2 py-1.5 text-sm hover:bg-stone-100 rounded-md transition flex flex-row gap-2 items-center">
                            <HistoryIcon size={15} /> History Approval
                        </button>
                        <button onClick={handleOpenTableHistory} className="text-left px-2 py-1.5 text-sm hover:bg-stone-100 rounded-md transition flex flex-row gap-2 items-center">
                            <AlarmClockCheck size={15} /> Task History
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default PopupSection
