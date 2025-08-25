import { z } from "zod";
import { shelfLifeOptions } from "../../../constants/general";

const alToNieBaseFormSchemas = {
  APPROVAL_TYPE: z.string().optional().nullable(),
  DEVELOPMENT_CATEGORY: z.string().min(1, { message: "Development Category is required" }),
  DISTRIBUTOR: z.string().optional().nullable(),
  DOSSIER_NUMBER: z.string().optional().nullable(),
  FINISHED_PRODUCT_ID: z.string().min(1, { message: "Finished Product ID is required" }),
  FINISHED_PRODUCT_DESCRIPTION: z.string().min(1, { message: "Product Name is required" }),
  INFOTEHNA_DOC_NO: z.string().min(1, { message: "Infotehna Doc No is required" }),
  INITIAL_REGISTRATION_DATE: z.date().optional().nullable(),
  MA_REFERENCE_CPP: z.string().optional().nullable(),
  MANUFACTURING_SITE: z.string().min(1, { message: "Manufacturing Site is required" }),
  PCF_NO: z.string().optional().nullable(),
  RA_AGENT: z.string().optional().nullable(),
  REGULATORY_DOSAGE_FORM: z.string().min(1, { message: "Regulatory Dosage Form is required" }),
  REGULATORY_PACK_SIZE: z.string().min(1, { message: "Regulatory Pack Size is required" }),
  REGULATORY_PRODUCT_CATEGORY: z.string().min(1, { message: "Regulatory Product Category is required" }),
  REGULATORY_SHELF_LIFE: z.enum(shelfLifeOptions, { message: "Regulatory Shelf Life is required" }),
  REMARK: z.string().optional()
}

const alFormSchemas = {
  AL_APPROVAL_DATE: z.date({ message: "AL Approval Date is required" }),
  AL_EXPIRY_DATE: z.date({ message: "AL Expiry Date is required" }),
  MARKETING_AUTHORIZATION_FILE: z.any().refine(val => val !== null && val !== undefined, { message: "AL Document is required" }),
  NIE_MA_HOLDER: z.string().min(1, { message: "AL Holder is required" }),
  NIE_MA_NO: z.string().min(1, { message: "AL No is required" }),
  REGISTRATION_PRODUCT_NAME: z.string().min(1, { message: "AL Product Name is required" }),
}

const nieFormSchemas = {
  ADDITIONAL_COMMITMENTS: z.array(z.object({
    COMMITMENT_TYPE: z.string().optional(),
    DUE_DATE: z.date().nullable().optional(),
    STATUS: z.enum(["Open", "Close"]).optional().nullable(),
  })).superRefine((data, ctx) => {
    const hasFilledField = data.some(item => item.COMMITMENT_TYPE || item.DUE_DATE || item.STATUS);
    if (hasFilledField) {
      data.forEach((item, index) => {
        const noCommitmentType = item.COMMITMENT_TYPE === "NONE";
        if (!item.COMMITMENT_TYPE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Commitment Type is required",
            path: [index, "COMMITMENT_TYPE"]
          });
        }
        if (!item.DUE_DATE && !noCommitmentType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Due Date is required",
            path: [index, "DUE_DATE"]
          });
        }
        if (!item.STATUS && !noCommitmentType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Status is required",
            path: [index, "STATUS"]
          });
        }
      });
    }
  }),
  MARKETING_AUTHORIZATION_FILE: z.any().refine(val => val !== null && val !== undefined, { message: "MA Document is required" }),
  NIE_MA_HOLDER: z.string().min(1, { message: "NIE/MA Holder is required" }),
  NIE_MA_NO: z.string().min(1, { message: "NIE/MA No is required" }),
  NIE_MA_APPROVAL_DATE: z.date({ message: "NIE/MA Approval Date is required" }),
  NIE_MA_EXPIRY_DATE: z.date({ message: "NIE/MA Expiry Date is required" }),
  REGISTRATION_PRODUCT_NAME: z.string().min(1, { message: "NIE/MA Product Name is required" }),
}

export const submissionSchemas = {
  // RA Partner Submission Section
  raPartnerSubmission: z.object({
    submissionDate: z.date({ message: "Submission Date is required" }),
  }),
  // Pra-Reg Section
  praRegSubmission: z.object({
    praRegDate: z.date({ message: "Pra-Reg Date is required" }),
  }),
  praRegAdditionalSubmission: z.object({
    data: z.array(z.object({
      subject: z.string().min(1, { message: "Subject is required" }),
      submissionDate: z.date({ message: "Submission Date is required" }),
      issuedDate: z.date({ message: "Issued Date is required" }),
    })),
  }),
  praRegSubmissionResult: z.object({
    status: z.enum(["Approved", "Rejected"]),
    statusUpdateDate: z.date({ message: "Status Update Date is required" }),
    hprDocument: z.any().refine(val => val !== null && val !== undefined, { message: "HPR Document is required" }),
  }),
  // Registration Section
  registrationSubmission: z.object({
    registrationDate: z.date({ message: "Registration Date is required" }),
  }),
  registrationAdditionalSubmission: z.object({
    data: z.array(z.object({
      subject: z.string().min(1, { message: "Subject is required" }),
      submissionDate: z.date({ message: "Submission Date is required" }),
      issuedDate: z.date({ message: "Issued Date is required" }),
    })),
  }),
  // Approvable Letter (AL) Section
  alSubmissionResult: z.object({
    ...alToNieBaseFormSchemas,
    ...alFormSchemas,
  }),
  alToMaNieSubmission: z.object({
    alToMaNieDate: z.date({ message: "AL to MA/NIE Date is required" }),
  }),
  // Marketing Authorization (NIE) Section
  marketingAuthorizationNieSubmission: z.object({
    status: z.enum(["Approved", "Rejected"]),
    rejectionDate: z.date({ message: "Rejection Date is required" }),
    remark: z.string().min(1, { message: "Remark is required" }),
    attachment: z.any().optional().nullable(),
  }),
  marketingAuthorizationNieSubmissionForm: z.object({
    ...alToNieBaseFormSchemas,
    ...nieFormSchemas,
  }),
}
