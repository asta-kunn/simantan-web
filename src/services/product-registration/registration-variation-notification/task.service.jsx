import productRegistrationInstance from "@/api/instances/product-registration.instance";

// Pure API routing - no business logic, no try-catch, no error handling

// Get all tasks with optional filtering
export const getAllTasks = async (params = {}) => 
  await productRegistrationInstance.get("/registration-variation-notification/task", { params });

// Create new task
export const postNewTask = async (taskData) => 
  await productRegistrationInstance.post("/registration-variation-notification/task", taskData);

// Assign tasks
export const assignTasks = async (assignTaskData) => 
  await productRegistrationInstance.post("/registration-variation-notification/task/assign", assignTaskData);

// Update task
export const updateTask = async (taskId, taskData) => 
  await productRegistrationInstance.put(`/registration-variation-notification/task/${taskId}`, taskData);

// Delete task - Using request body to avoid URL encoding issues
export const deleteTask = async (ccNo) => {
  const deleteConfig = {
    suppressErrorToast: true // Suppress automatic error toast
  };

  try {
    return await productRegistrationInstance.delete(`/registration-variation-notification/task/${ccNo}`, deleteConfig);
  } catch (error) {
    console.log("URL approach failed, trying request body approach:", error);
    
    try {
      return await productRegistrationInstance.delete('/registration-variation-notification/task', {
        data: { ccNo: decodeURIComponent(ccNo) }, // Decode it back for body
        suppressErrorToast: true
      });
    } catch (bodyError) {
      console.log("Body approach failed, trying params approach:", bodyError);
      
      try {
        return await productRegistrationInstance.delete('/registration-variation-notification/task', {
          params: { ccNo: decodeURIComponent(ccNo) },
          suppressErrorToast: true
        });
      } catch (paramsError) {
        // Re-throw the original error with more context for the mutation to handle
        const finalError = new Error(`Failed to delete Change Control: ${ccNo}`);
        finalError.originalError = paramsError;
        finalError.status = paramsError?.response?.status;
        throw finalError;
      }
    }
  }
};

/** Services Hooks */
export const postAssignTask = async (assignTaskData) => 
  await productRegistrationInstance.post("/registration-variation-notification/task/assign", assignTaskData);
