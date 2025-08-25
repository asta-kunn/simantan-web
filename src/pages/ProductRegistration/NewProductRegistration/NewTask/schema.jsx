import { z } from "zod";

// New Task Schema
export const newTaskSchema = z.object({
  PCF_NO: z.string().min(1, { message: "PCF No is required" }),
  FINISHED_PRODUCTS: z.array(z.object({
    FINISHED_PRODUCT: z.string().min(1, { message: "Finished Product is required" }),
    ITEM_MASTER_ID: z.number().min(1, { message: "Item Master ID is required" }),
    MANUFACTURING_SITE: z.string().optional(),
    MARKETING_AUTHORIZATION_HOLDER_NAME: z.string().optional(),
    COUNTRY: z.string().optional(),
    ACTIVE_INGREDIENTS: z.array(z.string()).optional(),
  })).superRefine((items, ctx) => {
    const seen = new Map();

    items.forEach((item, index) => {
      const hasFinishedProduct = item.ITEM_MASTER_ID > 0;
      const hasManufacturingSite = typeof item.MANUFACTURING_SITE === "string" && item.MANUFACTURING_SITE.trim().length > 0;

      if (hasFinishedProduct && !hasManufacturingSite) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Manufacturing Site is required",
          path: [index, "MANUFACTURING_SITE"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please fill in the Manufacturing Site",
          path: [index, "FINISHED_PRODUCT"],
        });
      }

      const key = `${item.ITEM_MASTER_ID}-${item.MANUFACTURING_SITE}`;
      if (seen.has(key)) {
        const firstIndex = seen.get(key);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate Finished Product with same Manufacturing Site is not allowed",
          path: [index, "MANUFACTURING_SITE"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "There is a duplicate Finished Product with the same Manufacturing Site",
          path: [index, "FINISHED_PRODUCT"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate Finished Product with same Manufacturing Site is not allowed",
          path: [firstIndex, "MANUFACTURING_SITE"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "There is a duplicate Finished Product with the same Manufacturing Site",
          path: [firstIndex, "FINISHED_PRODUCT"],
        });
      } else {
        seen.set(key, index);
      }
    });
  }),
})

export const newTaskDefaultValues = {
  PCF_NO: "",
  FINISHED_PRODUCTS: [{
    FINISHED_PRODUCT: "",
    ITEM_MASTER_ID: 0,
    MANUFACTURING_SITE: "",
    MARKETING_AUTHORIZATION_HOLDER_NAME: "",
    COUNTRY: "",
    ACTIVE_INGREDIENTS: [],
  }],
}

// Assign Task Schema
export const assignTaskSchema = z.object({
  PIC_RA_USER_ID: z.string().min(1, { message: "PIC is required" }),
})

export const assignTaskDefaultValues = {
  PIC_RA_USER_ID: "",
}
