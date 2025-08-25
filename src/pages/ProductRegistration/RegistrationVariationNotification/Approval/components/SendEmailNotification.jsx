import { useEffect, useState } from "react";
import { Form, Input, Button, TextEditor } from "@/components/dexain";
import { Separator } from "@/components/ui/separator";
import { SendHorizontal } from "lucide-react";
import { EditorProvider, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

const SendEmailNotification = ({
  schemas,
  defaultValues,
  submitHandlers,
  closeModal,
}) => {
  const extensions = [
    StarterKit,
    Underline,
    TextStyle,
    Color.configure({ types: [TextStyle.name] }),
    Link.configure({ openOnClick: false }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ];
  
  // Email template HTML
  const fullHTML = `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InnoLife PLM Notification</title>
    <style>
      body {
        font-family: sans-serif;
        margin: 0;
        padding: 0;
        color: #333333;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 32px 20px;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .card-outer {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
        padding: 40px;
        margin: 20px 0 16px 0;
        border: 1px solid #e2e8f0;
      }
      .info-card {
        background-color: #f2f5f9;
        border: 1px solid #d2deeb;
        border-radius: 8px;
        padding: 18px 20px 14px 20px;
        margin-bottom: 8px;
      }
      .divider {
        border-top: 1px solid #e2e8f0;
        margin: 12px 0 14px 0;
      }
      .flex-row {
        display: block;
        margin-bottom: 10px;
      }
      .flex-item {
        display: inline-block;
        vertical-align: top;
        width: 45%;
        min-width: 180px;
        margin-bottom: 10px;
      }
      .label {
        font-size: 12px;
        color: #718096;
        margin-bottom: 2px;
      }
      .value {
        font-size: 14px;
        font-weight: bold;
        color: #222222;
        margin-bottom: 14px;
      }
      .button {
        background-color: #c53030;
        color: #ffffff;
        padding: 12px 32px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        text-align: center;
        letter-spacing: 0.5px;
        border: none;
        cursor: pointer;
        display: inline-block;
      }
      .signature {
        margin-top: 24px;
        font-size: 14px;
        color: #333333;
        border-top: 1px solid #e2e8f0;
        padding-top: 16px;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #a0aec0;
        margin-top: 18px;
        border-top: 1px solid #e2e8f0;
        padding-top: 8px;
      }
      .footer-content {
        width: 80%;
        display: block;
        margin-bottom: 10px;
      }
      .footer-brand {
        width: 20%;
        color: #c53030;
        font-weight: bold;
        font-style: italic;
        font-size: 15px;
        letter-spacing: 0.5px;
        text-align: right;
      }
      a {
        color: #3182ce;
        text-decoration: underline;
      }
      .red-link {
        color: #c53030;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div style="background-color: #f8f9fb; margin-bottom: 12px">
      <div class="container">
        <div class="header">
          <img src="cid:innolife-logo" alt="innolife-logo" style="max-width: 300px; margin-bottom: 8px" />
        </div>

        <div class="card-outer">
          <div style="margin-bottom: 18px; font-size: 14px">
            Dear <span style="font-weight: bold">{{RECIPIENT_NAME}}</span><br />
            {{ACTION}}
          </div>
          <div class="info-card">
            <div class="label">Submission ID</div>
            <div class="value">{{SUBMISSION_NO}}</div>
            <div class="divider"></div>
            <div class="label">Finished Product</div>
            <div class="value">{{FINISHED_PRODUCT_DESCRIPTION}}</div>
            <div class="flex-row" style="margin-bottom: 0px">
              <div class="flex-item" style="margin-bottom: 0px">
                <div class="label">MA Holder</div>
                <div class="value">{{MARKETING_AUTHOR_HOLDER}}</div>
              </div>
              <div class="flex-item" style="margin-bottom: 0px">
                <div class="label">Manufacturing Site</div>
                <div class="value">{{MANUFACTURING_SITE}}</div>
              </div>
            </div>
            <div class="label">Country</div>
            <div class="value">{{COUNTRY}}</div>
            <div class="divider"></div>
            <div class="flex-row">
              <div class="flex-item" style="margin-bottom: 0px">
                <div class="label">Assigned PIC</div>
                <div class="value" style="margin-bottom: 2px">{{ASSIGNED_PIC_NAME}}</div>
                <div style="font-size: 13px">{{ASSIGNED_PIC_EMAIL}}</div>
              </div>
              <div class="flex-item" style="margin-bottom: 0px">
                <div class="label">Assign Date</div>
                <div class="value">{{ASSIGNED_DATE}}</div>
              </div>
            </div>
          </div>
          <div style="font-size: 13px; color: #4a5568; margin-top: 12px">View the product registration details to monitoring.'</div>
          <div style="text-align: center; margin-top: 16px">
            <a href="{{VIEW_DETAILS}}" style="text-decoration: none">
              <span class="button">VIEW DETAILS</span>
            </a>
          </div>

          <div class="signature">
            Regards,<br /><br />
            <span style="font-weight: bold; color: #c53030">{{SENDER_NAME}}</span> (<span style="color: #c53030; text-decoration: underline">{{SENDER_EMAIL}}</span>)<br />
            {{SENDER_POSITION}}, {{SENDER_COMPANY}}
          </div>
        </div>
        <div style="font-size: 12px; color: #222; margin-top: 24px; margin-bottom: 0; padding-bottom: 0">
          Please contact Dito Ridho (<a href="mailto:dito.ridho@dexagroup.com" class="red-link">dito.ridho@dexagroup.com</a>) - IT team for further information
        </div>
        <div class="footer">
          <div class="footer-content">© 2025 innoLife - Innovation Driven Product Lifecycle Management</div>
          <div class="footer-brand">dexa group</div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHTML, "text/html");
  const bodyContent = doc.body.innerHTML;

  // Custom editor styles
  const editorStyles = `
    .ProseMirror {
      white-space: pre-wrap;
      min-height: 300px;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
    }
    
    .ProseMirror p {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .ProseMirror ul, .ProseMirror ol {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
  `;

  // Inject CSS into document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = editorStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const editor = useEditor({
    extensions,
    content: bodyContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Form
      schema={schemas}
      validation={schemas}
      defaultValues={defaultValues}
      onSubmit={submitHandlers}
    >
      <Input name="email" label="To" placeholder="Enter email" required />

      <Separator className="my-2" />
      <EditorContent editor={editor} />
      <Separator className="my-4" />
      <div className="w-full flex justify-between gap-2">
        <Button variant="outline" color="tertiary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          icon={<SendHorizontal className="size-4" />}
          type="submit"
          iconPosition="right"
        >
          Send
        </Button>
      </div>
    </Form>
  );
};

export default SendEmailNotification;
