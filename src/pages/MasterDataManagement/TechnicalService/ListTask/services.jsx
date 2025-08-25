import mainInstance from "@/api/instances/main.instance";

const fetchListFormula = async () => {
  try {
    const response = await mainInstance.get(`/vendor-list/formula-information`);
    console.log(response.data, 'API')
    const { success, data, } = response?.data;
    if (success) {
      return { success, data, };
    } else {
      return { success, error: data, };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
}


export default {
  fetchListFormula
};
