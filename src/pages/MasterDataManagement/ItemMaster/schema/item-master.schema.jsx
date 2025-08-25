import { z } from "zod";

export const schema = z.object({
  ITEM_MASTER_DESCRIPTION: z.string().min(1, "Finished Product is required"),
  MARKETING_AUTHORIZATION_HOLDER: z
    .string()
    .min(1, "Marketing Authorization Holder is required"),
  MANUFACTURING_SITE: z
    .array(
      z.string({
        value: z.string().min(1, "Manufacturing Site is required"),
      })
    )
    .min(1, "At least one Manufacturing Site is required"),
  COUNTRY: z.string().min(1, "Country is required"),
  ACTIVE_INGREDIENTS: z
    .array(
      z.object({
        value: z.string().min(1, "Active Ingredient is required"),
      })
    )
    .min(1, "At least one Active Ingredient is required"),
});
