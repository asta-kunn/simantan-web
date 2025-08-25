import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const fetchHistoryManufacture = async ({ manufId }) => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/manufacturer/${manufId}/history`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const fetchTaskHistoryQA = async ({ detailItemA, detailId }) => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/task-history-list/${detailItemA}/${detailId}`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const fetchApprovalHistoryQA = async ({ detailId }) => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/approval/${detailId}`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const fetchContries = async () => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/countries`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const fetchDetailTaskQA = async ({ param }) => {
    try {
        const response = await masterDataManagementInstance.get(param);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const fetchActionPlanQA = async () => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/action-plans`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, e, message: e.message };
    }
}

export const fetchManufacturingSiteQA = async () => {
    try {

        const response = await masterDataManagementInstance.get(`/vendor-list/manufacturing-sites`);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, e, message: e.message };
    }
}

export const fetchTableQA = async (param) => {
    try {
        const payload = { ...param }

        const response = await masterDataManagementInstance.post(`/vendor-list/qa-task-list`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const submitTaskQA = async (param) => {
    try {
        const payload = { ...param }

        const response = await masterDataManagementInstance.post(`/vendor-list/update-manufacturer-address`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}

export const insertAVL = async (param) => {
    try {
        const payload = { ...param }
        const response = await masterDataManagementInstance.post(`/vendor-list/insert-reservation-oracle`, payload);
        const { success, data, message } = response?.data.data;
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error, message: error.message };
    }
}
