import { z } from "zod";

const itemSchema = z.object({
    originalItem: z.string().min(3, "Original item wajib diisi"),
    originalQty: z.union([z.string(), z.number()]).refine(val => !!val, { message: "Original qty wajib diisi" }),
    originalUom: z.string().min(1, "Original UOM wajib diisi"),
    replacementItem: z.string().min(3, "Replacement item wajib diisi"),
    replacementQty: z.union([z.string(), z.number()]).refine(val => !!val, { message: "Replacement qty wajib diisi" }),
    replacementUom: z.string().min(1, "Replacement UOM wajib diisi"),
});

const formSchema = z.object({
    productName: z.string().min(1, "Product name wajib diisi"),
    formula: z.string().min(1, "Formula wajib diisi"),
    version: z.string().min(1, "Version wajib diisi"),
    validFrom: z.date({
        required_error: "Valid from wajib diisi",
        invalid_type_error: "Valid from tidak valid"
    }),
    validTo: z.date({
        required_error: "Valid to wajib diisi",
        invalid_type_error: "Valid to tidak valid"
    }),
    serializationStatus: z.string().min(1, "Serialization status wajib diisi"),
    serializationDate: z.date({
        required_error: "Serialization date wajib diisi",
        invalid_type_error: "Serialization date tidak valid"
    }),
    isMIChanged: z.string().min(1, "Is MI changed wajib diisi"),
    items: z.array(itemSchema).min(1, "Minimal 1 item harus diisi"),
    referenceNo: z.string().min(1, "Reference no wajib diisi"),
    serializationNotes: z.string().refine((val, ctx) => {
        const isMIChanged = ctx?.parent?.isMIChanged;
        if (isMIChanged === 'Y') {
            return !!val && val.trim() !== '';
        }
        return true;
    }, {
        message: "Serialization notes wajib diisi",
    }),
});

export { formSchema, itemSchema }
