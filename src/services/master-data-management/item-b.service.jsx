import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const findDetailItemBService = async (id) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-b/${id}`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const findItemIntermediateListService = async (fg_number) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-b/intermediate/${fg_number}`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const findViewItemBService = async (id) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-b/view-item-b/${id}`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const saveItemB = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/save-item-b`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const submitItemBManufacturer = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/submit-item-b`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const validateFormLogin = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/auth/login`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const updateManufactureAddress = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/update-manufacture-address`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const apiSubmitToWaiting = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/submit-qa-officer`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const apiRejectTask = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/reject-task`, payload);
        const { success, data, message } = response?.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const archiveItemBService = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/archive-task`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const apiSubmitCompleted = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-b/submit-qa-manager`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}
