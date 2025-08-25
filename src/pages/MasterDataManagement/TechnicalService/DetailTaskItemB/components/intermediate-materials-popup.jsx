import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TableViewItem from "./table-view-item";


const IntermediateMaterialsPopup = ({ isOpen, onClose, data, dataHeader  }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-[70vw]">
                <DialogHeader className="p-[-10px]">
                    <DialogTitle className="py-2">Intermediate Materials <span className="border border-rose-900 font-medium text-md ml-2 bg-rose-700 text-white p-1 rounded-full px-2">{dataHeader.ITEM_NUMBER} - {dataHeader.ITEM_DESCRIPTION}</span> </DialogTitle>
                    <div className="mt-4 max-h-[70vh]">
                        <TableViewItem
                            data={data}
                            history={false}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => { onClose() }}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default IntermediateMaterialsPopup;