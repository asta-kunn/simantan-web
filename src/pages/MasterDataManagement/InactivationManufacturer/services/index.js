import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const fetchTableInactivationManufacturer = async (param) => {
  try {
    console.log(param, 'PARAM')
    const response = await masterDataManagementInstance.post(
      `/inactive`,
      param
    );
    const { success, data, message } = response?.data;
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export const fetchItemFGOption = async () => {
  try {
    const response = await masterDataManagementInstance.get(`/inactive/item-a`);
    const { success, data, message } = response?.data;
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};


export const fetchDetailInactiveManufacture = async (item_fg) => {
  try {
    const item_number = item_fg.split(' - ')[0];
    const response = await masterDataManagementInstance.get(`/inactive/item-a/${item_number}`);
    const { success, data, message } = response?.data;
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export const insertInactiveManufacture = async (payload) => {
  try {
    const response = await masterDataManagementInstance.post(`/inactive/create`, payload);
    const { success, data, message } = response?.data;
    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};