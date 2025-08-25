import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

const findDetailInactiveManufacture = async (id) => {
  try {
    const response = await masterDataManagementInstance.get(
      `/inactive/detail/${id}`
    );

    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

const approveInactiveManufacture = async (payload) => {
  try {
    const { task_id, action_plan } = payload;

    const response = await masterDataManagementInstance.post(
      `/inactive/approve`,
      { inactive_id: task_id, action_plan: action_plan }
    );
    console.log(response, 'RESPONSE')

    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

const rejectInactiveManufacture = async (payload) => {
  try {
    const { task_id, action_plan } = payload;

    const response = await masterDataManagementInstance.post(
      `/inactive/reject`,
      { inactive_id: task_id, action_plan: action_plan }
    );

    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

const submitOracleApi = async (payload) => {
  try {
    const response = await masterDataManagementInstance.post(
      `/inactive/update-oracle`,
      payload
    );

    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

const fetchInactiveApproval = async (detailId) => {
  try {
    const response = await masterDataManagementInstance.get(`/inactive/approval-history/${detailId}`);
    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
}


const reactivateManufacturer = async (detailId) => {
  try {
    const response = await masterDataManagementInstance.patch(`/inactive/reactivate/${detailId}`);
    const { success, data, message } = response?.data || {};
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
}



export {
  findDetailInactiveManufacture,
  approveInactiveManufacture,
  rejectInactiveManufacture,
  submitOracleApi,
  fetchInactiveApproval,
  reactivateManufacturer
};
