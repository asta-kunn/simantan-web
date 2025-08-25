import mainInstance from "@/api/instances/main.instance";

/** Workflow Template */
export const getWorkflowTemplate = (data) =>
  mainInstance
    .get(`/workflow/template`, { params: data })
    .then((res) => res.data);
/** Workflow Transactional */
export const getWorkflowTask = (data) =>
  mainInstance.get(`/workflow/task/${data}`).then((res) => res.data);
export const actionWorkflowTask = (data) =>
  mainInstance.post(`/workflow/task`, data).then((res) => res.data);
