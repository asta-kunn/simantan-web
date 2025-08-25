import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import { Form } from "@/components/Dexain";
import { z } from "zod";
import { Uploader } from "@/components/Dexain";
import { Button } from "@/components/Dexain";

// Zod schema with per-file validation that can identify specific file errors
const validationSchema = z.object({
  documents: z
    .array(z.instanceof(File))
    .nonempty({ message: "At least one document is required" })
    .superRefine((files, ctx) => {
      files.forEach((file, idx) => {
        if (file.size > 15 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [idx],
            message: "File size must be less than 15MB",
          });
        }
      });
    }),
  pdfs: z
    .array(z.instanceof(File))
    .optional()
    .superRefine((files, ctx) => {
      if (files) {
        files.forEach((file, idx) => {
          if (file.size > 10 * 1024 * 1024) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [idx],
              message: "PDF size must be less than 10MB",
            });
          }
        });
      }
    }),
  images: z.instanceof(File)
    .superRefine((file, ctx) => {
      if (!file.type.startsWith("image/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only images allowed"
        });
      }
      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image size must be ≤5MB"
        });
      }
    }).nullable(),
  pngOnly: z.instanceof(File)
    .superRefine((file, ctx) => {
      if (file && file.type !== "image/png") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only PNG images allowed"
        });
      }
      if (file && file.size > 2 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "PNG size must be ≤2MB"
        });
      }
    }).nullable(),
});

const UploaderExample = () => {
  const onSubmit = (vals) => {
    console.log(vals);
    alert('Form submitted with values: ' + JSON.stringify(vals, null, 2));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Uploader with Custom Extensions</h2>
      <p className="text-gray-600">
        Demonstrasi penggunaan prop <code>extensions</code> untuk menentukan format file yang diperbolehkan.
        Setiap uploader bisa memiliki kombinasi extensions yang berbeda sesuai kebutuhan.
      </p>

      <ComponentExample
        title="Custom Extensions Examples"
        description="Berbagai kombinasi extensions yang bisa digunakan untuk membatasi jenis file yang bisa diupload."
        code={`
// Semua dokumen yang tersedia
<Uploader 
  name="documents" 
  type="file" 
  extensions={['docx', 'pdf', 'pptx', 'ppt']} 
  label="All Documents" 
  multiple={true} 
/>

// Hanya PDF
<Uploader 
  name="pdfs" 
  type="file" 
  extensions={['pdf']} 
  label="PDF Only" 
  multiple={true} 
/>

// Semua format gambar yang tersedia
<Uploader 
  name="images" 
  type="image" 
  extensions={['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico']} 
  label="All Images" 
  multiple={false} 
/>

// Hanya PNG
<Uploader 
  name="pngOnly" 
  type="image" 
  extensions={['png']} 
  label="PNG Only" 
  multiple={false} 
/>
        `}
      >
        <Form 
          validation={validationSchema} 
          defaultValues={{ 
            documents: [], 
            pdfs: [], 
            images: null, 
            pngOnly: null 
          }} 
          onSubmit={onSubmit}
        >
          <div className="space-y-4">
            <Uploader 
              name="documents" 
              type="file" 
              extensions={['docx', 'pdf', 'pptx', 'ppt']} 
              maxSize={15} 
              label="All Documents (DOCX, PDF, PPTX, PPT)" 
              required 
              multiple={true} 
            />
            
            <Uploader 
              name="pdfs" 
              type="file" 
              extensions={['pdf']} 
              maxSize={10} 
              label="PDF Only" 
              multiple={true} 
            />
            
            <Uploader 
              name="images" 
              type="image" 
              extensions={['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico']} 
              maxSize={5} 
              label="All Images (PNG, JPG, JPEG, GIF, BMP, TIFF, ICO)" 
              multiple={false} 
            />
            
            <Uploader 
              name="pngOnly" 
              type="image" 
              extensions={['png']} 
              maxSize={2} 
              label="PNG Only" 
              multiple={false} 
            />
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button type="submit">Submit & Validate</Button>
          </div>
        </Form>
      </ComponentExample>

      <ComponentExample
        title="Mixed Extensions Example"
        description="Contoh kombinasi extensions yang tidak biasa - misalnya gambar dan dokumen dalam satu uploader."
        code={`
// Gambar + PDF (unusual combination)
<Uploader 
  name="mixed" 
  type="file" 
  extensions={['png', 'jpg', 'pdf']} 
  label="Images + PDF" 
  multiple={true} 
/>
        `}
      >
        <Form 
          validation={z.object({
            mixed: z.array(z.instanceof(File)).optional()
          })} 
          defaultValues={{ mixed: [] }} 
          onSubmit={(vals) => console.log('Mixed files:', vals)}
        >
          <Uploader 
            name="mixed" 
            type="file" 
            extensions={['png', 'jpg', 'pdf']} 
            maxSize={10} 
            label="Mixed: Images + PDF (PNG, JPG, PDF)" 
            multiple={true} 
          />
          
          <div className="flex gap-2 mt-4">
            <Button type="submit">Submit Mixed</Button>
          </div>
        </Form>
      </ComponentExample>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Available Extensions:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700">Documents:</h4>
            <ul className="text-gray-600 mt-1">
              <li>• <code>docx</code> - Word Document</li>
              <li>• <code>pdf</code> - PDF Document</li>
              <li>• <code>pptx</code> - PowerPoint (newer)</li>
              <li>• <code>ppt</code> - PowerPoint (older)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Images:</h4>
            <ul className="text-gray-600 mt-1">
              <li>• <code>png</code> - PNG Image</li>
              <li>• <code>jpg</code> - JPEG Image</li>
              <li>• <code>jpeg</code> - JPEG Image</li>
              <li>• <code>gif</code> - GIF Image</li>
              <li>• <code>bmp</code> - Bitmap Image</li>
              <li>• <code>tiff</code> - TIFF Image</li>
              <li>• <code>ico</code> - Icon Image</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <code>extensions={['pdf']}</code> - Hanya PDF</li>
          <li>• <code>extensions={['png', 'jpg']}</code> - Hanya PNG dan JPG</li>
          <li>• <code>extensions={['docx', 'pdf']}</code> - Hanya Word dan PDF</li>
          <li>• <code>extensions={[]}</code> - Menggunakan default berdasarkan type</li>
          <li>• Tidak ada prop extensions - Sama dengan extensions=[]</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Coba upload file dengan extension yang tidak diperbolehkan</li>
          <li>• Perhatikan error message yang muncul sesuai dengan extensions yang diset</li>
          <li>• Coba upload file dengan ukuran melebihi limit</li>
          <li>• Lihat bagaimana accept attribute di input file berubah sesuai extensions</li>
        </ul>
      </div>
    </div>
  );
};

export default UploaderExample;
