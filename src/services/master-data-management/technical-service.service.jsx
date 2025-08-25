import masterDataManagementInstance from "@/api/instances/master-data-management.instance";


export const downloadReportByExcel = async ({ id }) => {
    try {
        console.log(id, 'ID')
        const response = await masterDataManagementInstance.post('/excel/generate-vendor-list-report', {
            formula_id: id
        }, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const date = new Date();
        const parsedDate = Date.parse(date);

        link.setAttribute('download', `${parsedDate}-AVL-Report.xlsx`);

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Gagal download file:', error);
    }
}

export const downloadReportByPdf = async ({ id }) => {
    try {
        const response = await masterDataManagementInstance.post('/pdf/generate-vendor-list-report-pdf', {
            formula_id: id
        }, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const date = new Date();
        const parsedDate = Date.parse(date);

        link.setAttribute('download', `${parsedDate}-AVL-Report.pdf`);

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Gagal download file:', error);
    }
}


export const checkNieAndUpdate = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/vendor-list/check-nie-and-update`, payload);
        const { success, data, message } = response?.data || {} 
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

export const fetchApprovalList = async ({ detailId }) => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/approval/${detailId}`);
        const { success, data, message } = response?.data || {}
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

export const fetchTaskHistoryList = async ({ detailItemA, detailId }) => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/task-history-list/${detailItemA}/${detailId}`,);
        const { success, data, message } = response?.data || {}
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

export const fetchDetailTaskTechnicalService = async ({ param }) => {
    try {
        const response = await masterDataManagementInstance.get(param);
        const { success, data, message } = response?.data || {}
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

export const fetchTotalTask = async () => {
    try {
        const response = await masterDataManagementInstance.get("/vendor-list/total-task");
        const { success, data, message } = response?.data.data || {}
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

export const fetchTotalTaskItemSubstitution = async () => {
    try {
        const response = await masterDataManagementInstance.get("/item-substitution/count/request-submission");
        const { success, data, message } = response?.data.data || {}
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


export const fetchActionPlan = async () => {
    try {
        const response = await masterDataManagementInstance.get(`/vendor-list/action-plans`);
        const { success, data, message } = response?.data.data || {}
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: e.message };
    }
}

export const fetchManufacturingSite = async () => {
    try {

        const response = await masterDataManagementInstance.get(`/vendor-list/manufacturing-sites`);
        const { success, data, message } = response?.data.data || {}
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: e.message };
    }
}

export const fetchTableTechnicalService = async (param) => {
    try {
        const payload = { ...param }

        const response = await masterDataManagementInstance.post(`/vendor-list/formula-information`, payload);
        const { success, data, message } = response?.data.data || {}
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: e.message };
    }
}

export const saveDataTechnicalService = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/vendor-list/update-technical-task`, payload);
        const { success, data, message } = response?.data.data || {}
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: e.message };
    }
}

export const submitTechnicalServiceTask = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/vendor-list/submit-technical-service-task`, payload);
        const { success, data, message } = response?.data.data || {}
        if (success) {
            return { success, data, message };
        } else {
            return { success, error: data, message };
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: e.message };
    }
}
