import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const apiUomList = async () => {
    try {
        const response = await masterDataManagementInstance.get(`/item-substitution/uom-list`);
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

export const apiProductNameList = async () => {
    try {
        const response = await masterDataManagementInstance.get(`/item-substitution/item-product`);
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

export const apiFormulaList = async (productName) => {
    try {
        const productCode = productName.split(" - ")[0]
        const response = await masterDataManagementInstance.get(`/item-substitution/formula-number/${productCode}`);
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

export const apiVersionList = async (formula) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-substitution/version/${formula}`);
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

export const apiGetOriginalItem = async ({
    formula,
    version,
    productName
}) => {
    try {
        const response = await masterDataManagementInstance.post(`/item-substitution/original-item`, {
            formula_no: formula,
            version: version,
            item_fg_number: productName
        });
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

export const apiGetItemSubstitution = async (formula) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-substitution/substitution-item/${formula}`);
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

export const apiGetDraftItemSubstitusi = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/item-substitution/save`, payload);
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

export const apiUpdateItemSubstitusi = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-substitution/update/${payload.submission_id}`, payload);
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

export const apiSubmitItemSubstitusi = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/item-substitution/submit`, payload);
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

export const apiGetListTaskItem = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/item-substitution/list`, payload);
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

export const apiGetDetailSubstitutionItem = async (requestId) => {
    try {
        const response = await masterDataManagementInstance.get(`/item-substitution/${requestId}`);
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

export const apiSubmitApproval = async (payload) => {
    try {
        const response = await masterDataManagementInstance.patch(`/item-substitution/approve`, payload);
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

export const apiGetApprovalTaskItem = async (payload) => {
    try {
        const response = await masterDataManagementInstance.post(`/item-substitution/approval-list`, payload);
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


