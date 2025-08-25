export const taskStatus = {
  SUBMITTED: "Submitted",
  NEED_ACTION: "Need Action",
  NOT_STARTED: "Not Started",
  NOT_REQUIRED: "Not Required",
}

export const submissionStatus = {
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  REJECTED_BY_RA_MANAGER: "Rejected by RA Manager",
  WAITING_FOR_APPROVAL: "Waiting for Approval",
  WAITING_FOR_REVIEW: "Waiting for Review",
}

export const requestStatusVariantMap = {
  [taskStatus.SUBMITTED.toLowerCase()]: "success",
  [taskStatus.NEED_ACTION.toLowerCase()]: "warning",
  [taskStatus.NOT_STARTED.toLowerCase()]: "disable",
  [taskStatus.NOT_REQUIRED.toLowerCase()]: "primary",
}

export const registrationKeyMap = {
  IS_AL: "Need AL",
  IS_NIE: "Need NIE",
  IS_PRAREG: "Need Pre-Reg",
}

export const projectTaskCode = {
  RA_PARTNER_SUBMISSION: "RA_PARTNER_SUBMISSION",
  PRA_REG_SUBMISSION: "PRA_REG_SUBMISSION",
  PRA_REG_ADDITIONAL_SUBMISSION: "PRA_REG_ADDITIONAL_SUBMISSION",
  PRA_REG_SUBMISSION_RESULT: "PRA_REG_SUBMISSION_RESULT",
  REGISTRATION_SUBMISSION: "REGISTRATION_SUBMISSION",
  REGISTRATION_ADDITIONAL_SUBMISSION: "REGISTRATION_ADDITIONAL_SUBMISSION",
  APPROVABLE_LETTER_AL_SUBMISSION_RESULT: "APPROVABLE_LETTER_AL_SUBMISSION_RESULT",
  AL_TO_MA_NIE_SUBMISSION: "AL_TO_MA_NIE_SUBMISSION",
  MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT: "MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT",
}

export const projectTaskNames = {
  [projectTaskCode.RA_PARTNER_SUBMISSION]: "RA Partner Submission",
  [projectTaskCode.PRA_REG_SUBMISSION]: "Pra-Reg Submission",
  [projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION]: "Pra-Reg Additional Data Submission",
  [projectTaskCode.PRA_REG_SUBMISSION_RESULT]: "Pra-Reg Submission Result",
  [projectTaskCode.REGISTRATION_SUBMISSION]: "Registration Submission",
  [projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION]: "Registration Additional Data Submission",
  [projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT]: "Approvable Letter (AL) Submission Result",
  [projectTaskCode.AL_TO_MA_NIE_SUBMISSION]: "AL to MA/NIE Submission",
  [projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT]: "Marketing Authorization (NIE) Submission Result",
}

export const projectTaskCodeByName = {
  [projectTaskNames.RA_PARTNER_SUBMISSION]: projectTaskCode.RA_PARTNER_SUBMISSION,
  [projectTaskNames.PRA_REG_SUBMISSION]: projectTaskCode.PRA_REG_SUBMISSION,
  [projectTaskNames.PRA_REG_ADDITIONAL_SUBMISSION]: projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION,
  [projectTaskNames.PRA_REG_SUBMISSION_RESULT]: projectTaskCode.PRA_REG_SUBMISSION_RESULT,
  [projectTaskNames.REGISTRATION_SUBMISSION]: projectTaskCode.REGISTRATION_SUBMISSION,
  [projectTaskNames.REGISTRATION_ADDITIONAL_SUBMISSION]: projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION,
  [projectTaskNames.APPROVABLE_LETTER_AL_SUBMISSION_RESULT]: projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT,
  [projectTaskNames.AL_TO_MA_NIE_SUBMISSION]: projectTaskCode.AL_TO_MA_NIE_SUBMISSION,
  [projectTaskNames.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT]: projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT,
}

export const projectTaskType = {
  PREPARATION: "Preparation",
  PRA_REG: "Pra-Reg",
  REGISTRATION: "Registration",
}

export const getStatusColor = (status) => {
  const statusColor = {
    success: [submissionStatus.COMPLETED, taskStatus.SUBMITTED],
    danger: [
      submissionStatus.REJECTED_BY_RA_MANAGER,
      submissionStatus.CANCELLED,
    ],
    warning: [
      submissionStatus.WAITING_FOR_REVIEW,
      submissionStatus.WAITING_FOR_APPROVAL,
      taskStatus.NEED_ACTION,
    ],
    info: [submissionStatus.IN_PROGRESS],
  };

  const color =
    Object.entries(statusColor).find(([, statuses]) =>
      statuses.some((s) => status?.toLowerCase().includes(s.toLowerCase()))
    )?.[0] || "info";

  return color;
}

export const positionCodes = {
  SUPERUSER: "SUPERUSER",
  QA: "QA",
  RA_OPS: "RA_OPS",
  RA_PMO: "RA_PMO",
  RA_MGR_INA: "RA_MGR_INA",
  RA_MGR_OVERSEAS: "RA_MGR_OVERSEAS",
  RA_SS: "RA_SS",
  RA_REVIEWER: "RA_REVIEWER",
  TS: "TS",
  IT: "IT",
}

export const approvalTypes = [
  "MA",
  "No Registration",
  "Notice of Renewal",
  "Visa Extension",
  "CPR Extension",
  "CLIDP-in",
  "CLIDP-out",
]

export const shelfLifeOptions = ["24", "48", "72", "96", "120"]

export const MarketingAuthorizationType = {
  NEW: "NEW",
  VARIATION: "VARIATION",
  RENEWAL: "RENEWAL",
}