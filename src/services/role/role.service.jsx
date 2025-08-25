import mainInstance from "@/api/instances/main.instance";

export const getRole = async () => {
    return await mainInstance.get("/role");
};

export const postRole = async (payload) => {
    return await mainInstance.post("/role", payload);
}

export const putRole = async (payload) => {
    return await mainInstance.put("/role", payload);
}

export const deleteRole = async (id) => {
    return await mainInstance.delete(`/role/${id}`);
}
