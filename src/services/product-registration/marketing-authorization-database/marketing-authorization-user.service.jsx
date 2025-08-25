import productRegistrationInstance from "@/api/instances/product-registration.instance";

export const getMarketingAuthorizationDatabaseAccess = async () => await productRegistrationInstance.get("/marketing-authorization-database/user-access");
