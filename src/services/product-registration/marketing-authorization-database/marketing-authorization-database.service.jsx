import productRegistrationInstance from "@/api/instances/product-registration.instance";

export const getMarketingAuthorizationDatabaseById = async (id) => await productRegistrationInstance.get(`/marketing-authorization-database/${id}`);

export const postMarketingAuthorizationDatabaseFilter = async (data) => {
  return await productRegistrationInstance.post("/marketing-authorization-database", data);
};

export const getMarketingAuthorizationDatabaseDistinct = async (field) => {
  return await productRegistrationInstance.get(`/marketing-authorization-database/distinct/${field}`);
};

export const getMarketingAuthorizationDatabaseVersionByDescription = async (finishedProductDescription) => {
  return await productRegistrationInstance.get("/marketing-authorization-database/version", {
    params: {
      finishedProductDescription,
    },
  });
};

export const getMarketingAuthorizationDatabaseDetail = async (version, finishedProductDescription) => {
  return await productRegistrationInstance.get("/marketing-authorization-database/detail", {
    params: {
      version,
      finishedProductDescription,
    },
  });
};

