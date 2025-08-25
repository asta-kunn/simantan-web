import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import techServiceStore from "@/stores/techServiceStore";
import { useUIStore } from "@/stores/uiStore";
import { initialManufacture } from "../../DetailTask/constants/qa-initial-value";

const useDetailTaskItemBStateHandler = () => {
    const detailId = techServiceStore((state) => state.detailId);
    const [rawmatList, setRawmatList] = useState([]);
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(initialManufacture);
    const [notes, setNotes] = useState('');
    const [openTableHistory, setOpenTableHistory] = useState(false);
    const [manufacturePopup, setManufacturePopup] = useState({
        isOpen: false,
        data: null
    });
    const [dialog, setDialog] = useState({
        approve: false,
        type: null
    });
    const [historyChanges, setHistoryChanges] = useState([]);
    const [title, setTitle] = useState({
        registration_type: '',
        infotehna_document_number: '',
        registration_number: '',
        segment: '',
        action_plan: ''
    });
    const [dataVersion, setDataVersion] = useState([
        { id: 1, title: "Recipe Version", value: "" },
        { id: 2, title: "Formula Version", value: "" },
        { id: 3, title: "AVL Version", value: "" },
        { id: 4, title: "MA Number And Version", value: "" },
        { id: 5, title: "Infotechna Document No.", value: "" },
    ]);
    const { openSheet } = useUIStore();

    const detailType = techServiceStore(state => state.detailType);
    const navigate = useNavigate();


    return {
        detailId,
        rawmatList,
        setRawmatList,
        disableButton,
        setDisableButton,
        isOpen,
        setIsOpen,
        editedItem,
        setEditedItem,
        notes,
        setNotes,
        openTableHistory,
        setOpenTableHistory,
        manufacturePopup,
        setManufacturePopup,
        dialog,
        setDialog,
        historyChanges,
        setHistoryChanges,
        title,
        setTitle,
        dataVersion,
        setDataVersion,
        openSheet,
        detailType,
        navigate
    };
};

export default useDetailTaskItemBStateHandler
