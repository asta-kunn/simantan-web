import mainInstance from "@/api/instances/main.instance";

export const login = (data) => mainInstance.post("/auth/login", data);
export const logout = () => mainInstance.post("/auth/logout");
export const register = (data) => mainInstance.post("/auth/register", data);
