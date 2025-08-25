import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { get } from "lodash";

// Tiptap Extensions
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

// Icons from react-icons (run: npm install react-icons)
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaLink,
  FaUndo,
  FaRedo
} from "react-icons/fa";

// A simple separator for the toolbar
const MenuSeparator = () => (
  <div
    style={{
      width: "1px",
      height: "24px",
      backgroundColor: "#e5e7eb",
      alignSelf: "center",
    }}
  />
);

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const buttonStyle = {
    background: "transparent",
    border: "none",
    borderRadius: "4px",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#e0e7ff",
    color: "#4f46e5",
  };

  return (
    <div
      className="menu-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "8px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Group 1: Bold, Italic, Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={editor.isActive("bold") ? activeButtonStyle : buttonStyle}
        title="Bold"
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={editor.isActive("italic") ? activeButtonStyle : buttonStyle}
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        style={editor.isActive("underline") ? activeButtonStyle : buttonStyle}
        title="Underline"
      >
        <FaUnderline />
      </button>

      <MenuSeparator />

      {/* Group 2: Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
        style={
          editor.isActive({ textAlign: "left" })
            ? activeButtonStyle
            : buttonStyle
        }
        title="Align Left"
      >
        <FaAlignLeft />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
        style={
          editor.isActive({ textAlign: "center" })
            ? activeButtonStyle
            : buttonStyle
        }
        title="Align Center"
      >
        <FaAlignCenter />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
        style={
          editor.isActive({ textAlign: "right" })
            ? activeButtonStyle
            : buttonStyle
        }
        title="Align Right"
      >
        <FaAlignRight />
      </button>
      
      <MenuSeparator />

      {/* Group 3: Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={editor.isActive("orderedList") ? activeButtonStyle : buttonStyle}
        title="Ordered List"
      >
        <FaListOl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={editor.isActive("bulletList") ? activeButtonStyle : buttonStyle}
        title="Bullet List"
      >
        <FaListUl />
      </button>

      <MenuSeparator />

      {/* Group 4: Link */}
      <button
        type="button"
        onClick={setLink}
        style={editor.isActive("link") ? activeButtonStyle : buttonStyle}
        title="Set Link"
      >
        <FaLink />
      </button>

      {/* This maintains the extra features from your original code */}
      <MenuSeparator />

      {/* Group 5: Headings & Color */}
       <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={
          editor.isActive("heading", { level: 1 })
            ? { ...activeButtonStyle, fontWeight: "bold" }
            : { ...buttonStyle, fontWeight: "bold" }
        }
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={
          editor.isActive("heading", { level: 2 })
            ? { ...activeButtonStyle, fontWeight: "bold" }
            : { ...buttonStyle, fontWeight: "bold" }
        }
      >
        H2
      </button>
      <input
        type="color"
        title="Text color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes("textStyle").color || "#000000"}
        style={{
          width: "28px",
          height: "28px",
          border: "none",
          background: "none",
          cursor: "pointer",
          alignSelf: "center",
        }}
      />

      <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          style={{
            ...buttonStyle,
            opacity: editor.can().undo() ? 1 : 0.5,
          }}
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          style={{
            ...buttonStyle,
            opacity: editor.can().redo() ? 1 : 0.5,
          }}
          title="Redo"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

export const TextEditor = ({
  name,
  placeholder = "Write something...",
  className = "",
  label,
  required,
  defaultValue,
  value,
  onChange,
  info,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const methods = useFormContext?.();
  const isUsingForm = !!(methods?.register && name);
  const error =
    name && methods?.formState?.errors
      ? get(methods.formState.errors, name)
      : undefined;

  const watchedValue = isUsingForm ? methods?.watch(name) : undefined;

  const currentValue = isUsingForm
    ? watchedValue
    : value !== undefined
    ? value
    : internalValue;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: currentValue,
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (isUsingForm) {
        methods.setValue(name, html, { shouldValidate: true });
      } else if (value === undefined) {
        setInternalValue(html);
      }

      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: `text-editor`,
        style: `
          min-height: 250px;
          padding: 12px;
          font-size: 1rem;
          background: #F4F7FA;
          outline: none;
          flex-grow: 1;
        `,
      },
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable) {
      const editorContent = editor.getHTML();
      if (editorContent !== currentValue) {
        editor.commands.setContent(currentValue, false);
      }
    }
  }, [currentValue, editor])

  const registerOptions = isUsingForm ? methods.register(name) : {};

  const wrapperStyle = {
    border: `1px solid ${error ? "#b32017" : "#e5e7eb"}`,
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "#E9EEF5",
    transition: "border-color 0.2s",
  };

  const editorStyles = `
  .text-editor h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
  .text-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
  .text-editor a { color: #3b82f6; text-decoration: underline; cursor: pointer; }
  .text-editor ul, .text-editor ol { padding-left: 2rem; margin: 1rem 0; }
  .text-editor ul { list-style-type: disc; }
  .text-editor ol { list-style-type: decimal; }
  .text-editor p { margin: 0.5rem 0; }
`;
  
  return (
    <div
      className={`text-editor-wrapper w-full ${className}`}
      style={{ margin: "8px 0" }}
    >

      <style>{editorStyles}</style>

      {label && (
        <div className="flex items-center gap-1">
          <label className="block text-base font-medium mb-1.5">{label}</label>
          {required && (
            <span className="text-primary-normal self-start">*</span>
          )}
        </div>
      )}

      {isUsingForm && (
        <input
          type="hidden"
          name={name}
          value={currentValue || ""}
          {...registerOptions}
        />
      )}
      
      <div style={wrapperStyle}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-danger-normal-hover"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

TextEditor.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  info: PropTypes.node,
};

export default TextEditor;