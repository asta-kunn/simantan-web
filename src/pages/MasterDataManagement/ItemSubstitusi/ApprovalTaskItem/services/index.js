import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const fetchApprovalHistory = async (requestId) => {
    try {
      const response = await masterDataManagementInstance.get(`/item-substitution/approval-history/${requestId}`);
      const { success, data, message } = response?.data.data || {}
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
  