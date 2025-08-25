import existingProductImprovementInstance from "@/api/instances/existing-product-improvement.instance";

export const createNewRequest = (data) => existingProductImprovementInstance.post('/epi/new-request', data).then(res => res.data);