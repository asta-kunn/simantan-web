import { Button } from "@/components/Dexain"
import { userRole } from "@/constants/role.constant";
import { PlusIcon } from "lucide-react"

const HeaderPresenter = ({ openSheet, user }) => {

    const isManager = user?.ROLE_CODE === userRole.QA_MANAGER;

    return (
        <div className="flex flex-row gap-2 mb-4 justify-between items-center">
            <div className="flex flex-col">
                <p className="text-xl font-semibold">Inactivation & Reactivation Manufacturer</p>
                <p className="text-md text-gray-500">Maintain finished product material items and manufacturer mapping</p>
            </div>
            {!isManager && (
                <div className="flex flex-col">
                    <Button color="primary" onClick={openSheet} disabled={isManager}>
                        <PlusIcon className="w-4 h-4" />
                        Inactivate Manufacturer
                    </Button>
                </div>
            )}
        </div>
    )
}

export default HeaderPresenter