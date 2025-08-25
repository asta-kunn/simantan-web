import mainInstance from "@/api/instances/main.instance";

export const getResponsibilities = async () => {
    return await mainInstance.get("/responsibilities");
};

export const postResponsibilities = async (payload) => {
    return await mainInstance.post("/responsibilities", payload);
}

export const putResponsibilities = async (payload) => {
    return await mainInstance.put("/responsibilities", payload);
}
export const deleteResponsibilities = async (id) => {
    return await mainInstance.delete(`/responsibilities/${id}`);
}

