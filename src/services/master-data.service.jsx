import mainInstance from "@/api/instances/main.instance";

export const getActiveIngredientsMaster = (searchQuery) =>
  mainInstance.get("/master-data/active-ingredient", {
    params: { name: searchQuery },
  });

export const getOrganizations = () => mainInstance.get("/master-data/organization");

export const getCompanies = () => mainInstance.get("/master-data/company");

export const getCountries = () => mainInstance.get("/master-data/country");

export const getUsersByRole = async (roleCode) => await mainInstance.get(`/master-data/user?ROLE_CODE=${roleCode}`);

export const getProjectTasks = async (registrationType) => await mainInstance.get(`/master-data/registration/project-task?REGISTRATION_TYPE=${registrationType}`);

export const getFinishedProducts = (searchQuery, isRegistered) =>
  mainInstance.get(`/master-data/registration/finished-product`, {
    params: { ITEM_MASTER_DESCRIPTION: searchQuery, IS_REGISTERED: isRegistered },
  });

export const getChangeType = async () => await mainInstance.get("/master-data/epi/subcategory?CATEGORY_ID=1");

export const getUsers = (params) => mainInstance.get(`/master-data/user`, params ? { params } : {});

export const getRoles = () => mainInstance.get(`/master-data/role`);

export const getMilis = () => mainInstance.get(`/master-data/milis`);

export const getMAHolders = () => mainInstance.get(`/master-data/registration/ma-holder`);

export const getDevelopmentCategories = () => mainInstance.get(`/master-data/registration/category-development`);

export const getPharmaceuticalForms = () => mainInstance.get(`/master-data/registration/pharmaceutical-form`);

export const getProductCategories = () => mainInstance.get(`/master-data/registration/product-category`);

export const getCommitmentTypes = () => mainInstance.get(`/master-data/registration/commitment-type`);

export const getRegistrationEmailTemplate = (payload) => mainInstance.get(`/master-data/registration/email-template`, payload ? { params: payload } : {});
