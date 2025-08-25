import productRegistrationInstance from "@/api/instances/product-registration.instance";

// Basic API calls - no logic, just routing

export const patchProjectTaskData = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission`,
    payload
  );

export const patchAddProjectTaskVersion = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/add-version`,
    payload
  );

export const patchCancelProjectTask = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/cancel-project-task`,
    payload
  );

export const insertApprovableLetterSubmissionResult = async (payload) =>
  await productRegistrationInstance.post(
    `/registration-variation-notification/submission/marketing-authorization`,
    payload
  );

export const countTaskSubmission = async () =>
  await productRegistrationInstance.get(
    `/registration-variation-notification/submission/count`
  );

export const getOutstandingSubmissionApprovalTasks = async () => {
  return await productRegistrationInstance.get(`/approval/tasks`);
};

export const getOutstandingSubmissionApprovalHistory = async () => {
  return await productRegistrationInstance.get(`/approval/history`);
};

export const getProjectTaskHistory = async (submissionId) => {
  return await productRegistrationInstance.get(`/registration-variation-notification/submission/${submissionId}/project-task-history`);
};

// Get monitoring submissions
export const getMonitoringSubmissions = async (params = {}) => {
  return productRegistrationInstance.get(
    `/registration-variation-notification/submission/monitoring`,
    { params }
  );
};

// Get submissions by role and tab context
export const getSubmissionsByRoleAndTab = async (
  roleCode,
  tabContext,
  additionalParams = {}
) => {
  const queryParams = new URLSearchParams();

  // Add role and tab context
  if (roleCode) queryParams.append("roleCode", roleCode);
  if (tabContext) queryParams.append("tabContext", tabContext);

  // Add any additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  return productRegistrationInstance.get(
    `/registration-variation-notification/submission?${queryParams.toString()}`
  );
};

/** ===============================================================================
 * ========================== Submission Assigned Section ==========================
 * =============================================================================== */

export const getSubmissions = async ({ roleCode }) => {
  return productRegistrationInstance.get(
    `/registration-variation-notification/submission`,
    {
      params: { roleCode },
    }
  );
};

export const getSubmissionByID = async (submissionId) =>
  await productRegistrationInstance.get(
    `/registration-variation-notification/submission/${submissionId}`
  );

export const patchConfirmAndSubmitSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/confirm`,
    payload
  );

export const patchCancelSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/cancel`,
    payload
  );

export const patchReassignSubmission = async (payload) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/reassign`,
    payload
  );

/** ===============================================================================
 * ===================== Submission Review & Approval Section =====================
 * =============================================================================== */

/** Submission Review Update Email Notification */
export const putSubmissionEmailNotification = async (payload) =>
  await productRegistrationInstance.put(
    `/registration-variation-notification/submission/review/email-notification`,
    payload
  );

/** Submit Button in Approval for Update Submission Review */
export const patchSubmissionReview = async (SUBMISSION_ID) =>
  await productRegistrationInstance.patch(
    `/registration-variation-notification/submission/review/${SUBMISSION_ID}`
  );

/** Submit Button in Approval for Update Submission Approval */
export const putSubmissionApproval = async (payload) =>
  await productRegistrationInstance.put(
    `/registration-variation-notification/submission/approval`,
    payload
  );

/** Edit Marketing Authorization */
export const putEditMarketingAuthorization = async (payload) =>
  await productRegistrationInstance.put(
    `/registration-variation-notification/submission/review/marketing-authorization`,
    payload
  );

export const getSubmissionApprovalInformation = async (submissionId) =>
  await productRegistrationInstance.get(
    `/registration-variation-notification/submission/approval/information`,
    { params: { submissionId } }
  );
