import masterDataManagementInstance from "@/api/instances/master-data-management.instance";

export const getItemMasterUnmapped = async (itemMasterDescription) =>
  await masterDataManagementInstance.get("/item-master/unmapped", {
    params: {
      itemMasterDescription,
    },
  });

export const putItemMaster = async (data) => {
  return await masterDataManagementInstance.put("/item-master", data);
};

export const postItemMaster = async (data) => {
  return await masterDataManagementInstance.post("/item-master/new-item", data);
};

export const postItemMasterSearch = async (data) => {
  return await masterDataManagementInstance.post("/item-master", data);
};
