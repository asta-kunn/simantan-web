import techServiceStore from '@/stores/techServiceStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '@/stores/authStore';
import { userRole } from '@/constants/role.constant';
import { useUIStore } from '@/stores/uiStore';

const useStateHandlerDetailInactivation = () => {

    // store    
    const detailTaskId = techServiceStore(state => state.detailTask);
    const user = authStore(state => state.user);

    //initial state
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isManager, setIsManager] = useState(
        user?.ROLE_CODE === userRole.QA_MANAGER
    );
    const [loading, setLoading] = useState(false);
    const [confirmLogin, setConfirmLogin] = useState(false);
    const [type, setType] = useState(null);
    const [submitOracleForm, setSubmitOracleForm] = useState(null);
    const { openSheet } = useUIStore();

    //hooks
    const navigate = useNavigate();
 
    return{
        navigate,
        isOpenDialog,
        setIsOpenDialog,
        detailTaskId,
        user,
        isManager,
        setIsManager,
        loading,
        setLoading,
        confirmLogin,
        setConfirmLogin,
        type,
        setType,
        submitOracleForm,
        setSubmitOracleForm,
        openSheet
    }
}

export default useStateHandlerDetailInactivation
