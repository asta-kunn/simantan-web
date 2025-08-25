import productRegistrationInstance from "@/api/instances/product-registration.instance";

// Pure API routing - no business logic, no try-catch, no error handling

// Get all tasks with optional filtering
export const getSubmissions = async (params = {}) =>
  await productRegistrationInstance.get(
    "/new-product-registration/submission",
    { params }
  );

export const getSubmissionById = async (submissionId) =>
  await productRegistrationInstance.get(
    `/new-product-registration/submission/${submissionId}`
  );

export const getProjectTaskHistory = async (submissionId) => {
  return await productRegistrationInstance.get(`/new-product-registration/submission/${submissionId}/project-task-history`);
};

export const patchCancelSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/cancel`,
    payload
  );

export const patchConfirmAndSubmitSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/confirm`,
    payload
  );

export const patchReassignSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/reassign`,
    payload
  );

export const patchCancelProjectTask = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/cancel-project-task`,
    payload
  );

export const patchProjectTaskData = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission`,
    payload
  );

export const patchAddProjectTaskVersion = async (payload) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/add-version`,
    payload
  );

/** Submission Review Section */
export const putEditMarketingAuthorization = async (payload) =>
  await productRegistrationInstance.put(
    `/registration-variation-notification/submission/review/marketing-authorization`,
    payload
  );

export const putSubmissionEmailNotification = async (payload) =>
  await productRegistrationInstance.put(
    `/new-product-registration/submission/review/email-notification`,
    payload
  );

export const patchSubmissionReview = async (SUBMISSION_ID) =>
  await productRegistrationInstance.patch(
    `/new-product-registration/submission/review/${SUBMISSION_ID}`
  );
/** End of Submission Review Section */

/** Approval Section */
export const putSubmissionApproval = async (payload) =>
  await productRegistrationInstance.put(
    `/new-product-registration/submission/approval`,
    payload
  );

export const getSubmissionApprovalInformation = async (submissionId) =>
  await productRegistrationInstance.get(
    `/new-product-registration/submission/approval/information`,
    { params: { submissionId } }
  );
/** End Of Approval Section */
