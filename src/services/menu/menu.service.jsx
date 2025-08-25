import mainInstance from "@/api/instances/main.instance";

export const getMenu = async (isFilterParent = 'N') => {
    return await mainInstance.get("/menu", {
        params: {
            is_filter_parent: isFilterParent
        }
    });
};

export const postMenu = async (payload) => {
    return await mainInstance.post("/menu", payload);
}

export const putMenu = async (payload) => {
    return await mainInstance.put("/menu", payload);
}

export const deleteMenu = async (id) => {
    return await mainInstance.delete(`/menu/${id}`);
}
