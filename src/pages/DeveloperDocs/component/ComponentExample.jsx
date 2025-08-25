import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, Eye, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";

/**
 * A reusable component that displays a component example with
 * animated toggle between the live example and code snippet
 */
export const ComponentExample = ({ children, title, description, code }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeValue, setCodeValue] = useState(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Determine language for syntax highlighting
  const getLanguage = (code) => {
    if (code.includes("import React") || code.includes("jsx")) return "jsx";
    if (code.includes("<html>") || code.includes("<div>")) return "html";
    if (code.includes("function") || code.includes("=>")) return "javascript";
    return "jsx"; // Default to JSX
  };

  // Get the appropriate Prism language for highlighting
  const getPrismLanguage = (code) => {
    const lang = getLanguage(code);
    switch (lang) {
      case "jsx":
        return languages.jsx;
      case "html":
        return languages.markup;
      case "javascript":
        return languages.javascript;
      default:
        return languages.jsx;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        </div>

        {/* Animated Toggle Button */}
        <div className="relative">
          <motion.div className="flex bg-gray-100 rounded-lg p-1" layout>
            <motion.button
              onClick={() => setShowCode(false)}
              className={cn(
                "flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors relative",
                !showCode
                  ? "text-primary-normal bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </motion.button>

            <motion.button
              onClick={() => setShowCode(true)}
              className={cn(
                "flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors relative",
                showCode
                  ? "text-primary-normal bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Animated Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!showCode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-6 w-full flex justify-center items-center"
            >
              <div className="w-full">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="relative"
            >
              <div className="bg-gray-900 text-gray-100 rounded-t-none overflow-x-auto">
                {/* Code editor header */}
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-primary-normal-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-400">
                      {getLanguage(codeValue)}
                    </span>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Code content with react-simple-code-editor */}
                <div className="font-mono text-sm">
                  <Editor
                    value={codeValue}
                    onValueChange={(code) => setCodeValue(code)}
                    highlight={(code) =>
                      highlight(code, getPrismLanguage(code), getLanguage(code))
                    }
                    padding={16}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      backgroundColor: "#1e1e1e",
                      minHeight: "200px",
                    }}
                    className="editor"
                    textareaClassName="editor__textarea"
                    preClassName="editor__pre"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
