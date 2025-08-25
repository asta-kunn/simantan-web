import productRegistrationInstance from "@/api/instances/product-registration.instance";

// Pure API routing - no business logic, no try-catch, no error handling

// Get all tasks with optional filtering
export const getUnassignedTasks = async (params = {}) => 
  await productRegistrationInstance.get("/new-product-registration/task", { params });

// Create new task
export const postNewTask = async (taskData) => 
  await productRegistrationInstance.post("/new-product-registration/task", taskData);

// Assign new task
export const postAssignTask = async (taskData) => 
  await productRegistrationInstance.post("/new-product-registration/task/assign", taskData);