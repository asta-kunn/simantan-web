import { cn, isEmpty } from "@/lib/utils";
import {
  FileText,
  Image as ImageIcon,
  Loader,
  Trash2,
  Upload,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { get } from "lodash";

const LoadingIcon = ({ className = "text-primary-normal" }) => (
  <div className="animate-spin">
    <Loader className={`w-5 h-5 ${className}`} />
  </div>
);

const FilePreview = ({ type, file, previewUrl, isLoading, multiple }) => {
  if (multiple) {
    return null;
  }
  
  return (
    <div className={cn(
      "w-10 h-10 rounded flex items-center justify-center",
      isLoading ? "bg-primary-normal" : "bg-primary-soft"
    )}>
      {type === "image" && previewUrl ? (
        <div className="relative w-full h-full">
          <img src={previewUrl} alt={file?.name} className="w-full h-full object-cover rounded" />
          {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded"><LoadingIcon className="text-white" /></div>}
        </div>
      ) : isLoading ? <LoadingIcon className="text-white" /> : <FileText className="text-primary-normal" size={24} />}
    </div>
  );
};

export const Uploader = memo(({ 
  name, 
  type = "file", 
  disabled = false, 
  files: filesProp, 
  maxSize, 
  multiple = true, 
  label, 
  onUploadComplete, 
  onDelete: externalOnDelete, 
  onChange: externalOnChange, 
  required = false ,
  extensions = []
}) => {
  const methods = useFormContext?.();
  const isUsingForm = !!(methods?.register && name);

  const [internalFiles, setInternalFiles] = useState(multiple ? [] : null);
  const [generalErrors, setGeneralErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  const error =
    name && methods?.formState?.errors
      ? get(methods.formState.errors, name)
      : undefined;

  const inputRef = useRef();
  const dropZoneRef = useRef();
  const [previewUrls, setPreviewUrls] = useState({});
  const [uploadStates, setUploadStates] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Helper function to check if value is existing file (string path)
  const isExistingFile = (value) => {
    return typeof value === 'string' && value.length > 0;
  };

  // Helper function to convert string path to display object
  const createFileDisplayObject = (filePath) => {
    return {
      name: filePath.split('/').pop() || 'Unknown File',
      isExistingFile: true,
      filePath: filePath
    };
  };

  // Get current files - either from form or props/internal state
  const currentFiles = useMemo(() => {
    if (isUsingForm) {
      const formValue = methods.getValues(name);
      if (multiple) {
        const files = Array.isArray(formValue) ? formValue : formValue ? [formValue] : [];
        return files.map(file => isExistingFile(file) ? createFileDisplayObject(file) : file);
      } else {
        return isExistingFile(formValue) ? createFileDisplayObject(formValue) : formValue;
      }
    } else {
      const files = !isEmpty(filesProp) ? filesProp : internalFiles;
      if (multiple) {
        const fileArray = Array.isArray(files) ? files : files ? [files] : [];
        return fileArray.map(file => isExistingFile(file) ? createFileDisplayObject(file) : file);
      } else {
        return isExistingFile(files) ? createFileDisplayObject(files) : files;
      }
    }
  }, [isUsingForm, methods, name, filesProp, internalFiles, multiple]);

  
  // Drag and drop event handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    // Only set dragOver to false if we're leaving the dropzone itself
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  // Function to extract per-file errors from Zod validation
  const extractFileErrors = (error) => {
    if (!error) return {};
    
    const fileErrors = {};
    
    // Handle different error formats from react-hook-form + Zod
    if (error.types) {
      // Handle multiple error types
      Object.entries(error.types).forEach(([key, message]) => {
        // Check for numeric keys which indicate file indices
        const pathMatch = key.match(/^(\d+)$/);
        if (pathMatch) {
          const fileIndex = parseInt(pathMatch[1]);
          fileErrors[fileIndex] = message;
        }
      });
    }
    
    // Handle Zod superRefine errors that come with root.index format
    if (error.root && typeof error.root === 'object') {
      Object.entries(error.root).forEach(([key, value]) => {
        if (!isNaN(parseInt(key)) && value?.message) {
          fileErrors[parseInt(key)] = value.message;
        }
      });
    }
    
    // Handle direct array index errors
    if (error.message && error.type) {
      // Try to extract file index from error ref if available
      const ref = error.ref;
      if (ref && ref.name) {
        const indexMatch = ref.name.match(/\[(\d+)\]/);
        if (indexMatch) {
          const fileIndex = parseInt(indexMatch[1]);
          fileErrors[fileIndex] = error.message;
        }
      }
    }

    return fileErrors;
  };

  // generate previews
  useEffect(() => {
    const previews = {};
    if (multiple) {
      currentFiles.forEach((file, idx) => {
        if (type === "image" && file instanceof File) previews[idx] = URL.createObjectURL(file);
      });
    } else if (currentFiles && type === "image" && currentFiles instanceof File) {
      previews[0] = URL.createObjectURL(currentFiles);
    }
    setPreviewUrls(prev => {
      Object.values(prev).forEach(url => { if (!Object.values(previews).includes(url)) URL.revokeObjectURL(url); });
      return previews;
    });
    return () => Object.values(previews).forEach(URL.revokeObjectURL);
  }, [currentFiles, type, multiple]);

  const maxBytes = (maxSize ?? (type === "image" ? 5 : 100)) * 1024 * 1024;
  const validateType = (file) => {
    // buat mapping extensions ke type
    const extensionsMap = {
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'pdf': 'application/pdf',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'ppt': 'application/vnd.ms-powerpoint',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'ico': 'image/x-icon',
    };
    
    // Jika extensions tidak didefinisikan, gunakan default berdasarkan type
    const allowedExtensions = extensions.length > 0 ? extensions : 
      (type === "image" ? ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'] : ['docx', 'pdf', 'pptx', 'ppt']);
    
    const allowedTypes = allowedExtensions.map(ext => extensionsMap[ext]).filter(Boolean);
    return file?.isExistingFile || allowedTypes.includes(file.type);
  };
  const validateSize = (file) => file?.isExistingFile || file.size <= maxBytes;
  const formatSize = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes/1024).toFixed(2)} KB` : `${(bytes/1048576).toFixed(2)} MB`;
  // Generate accept attribute berdasarkan extensions yang diperbolehkan
  const getAcceptAttribute = () => {
    const extensionsMap = {
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'pdf': 'application/pdf',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'ppt': 'application/vnd.ms-powerpoint',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'ico': 'image/x-icon',
    };
    
    const allowedExtensions = extensions.length > 0 ? extensions : 
      (type === "image" ? ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'] : ['docx', 'pdf', 'pptx', 'ppt']);
    
    const mimeTypes = allowedExtensions.map(ext => extensionsMap[ext]).filter(Boolean);
    const extensionList = allowedExtensions.map(ext => `.${ext}`);
    
    return [...mimeTypes, ...extensionList].join(',');
  };

  // Generate error message berdasarkan extensions yang diperbolehkan
  const getTypeErrorMessage = () => {
    const allowedExtensions = extensions.length > 0 ? extensions : 
      (type === "image" ? ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'] : ['docx', 'pdf', 'pptx', 'ppt']);
    
    const extensionText = allowedExtensions.map(ext => `.${ext.toUpperCase()}`).join(', ');
    return `Invalid type (only ${extensionText} allowed)`;
  };

  const updateFiles = (newFiles) => {
    if (isUsingForm) {
      methods.setValue(name, newFiles);
      methods.trigger(name);
    } else {
      setInternalFiles(newFiles);
      externalOnChange?.(newFiles);
    }
  };

  const handleFiles = (filesArray) => {
    const valid = [];
    const errors = {};
    filesArray.forEach((file, idx) => {
      if (!validateType(file)) errors[idx] = getTypeErrorMessage();
      else if (!validateSize(file)) errors[idx] = `File size must be less than ${formatSize(maxBytes)}`;
      else valid.push(file);
    });
    setGeneralErrors(errors);
    
    if (valid.length === 0) return;

    if (!multiple) {
      // For single file mode, don't wrap in array
      updateFiles(valid[0]);
      onUploadComplete?.(valid[0]);
      return;
    }

    // Get original files (with string paths for existing files)
    const formValue = isUsingForm ? methods.getValues(name) : (filesProp || internalFiles);
    const originalFiles = Array.isArray(formValue) ? formValue : formValue ? [formValue] : [];
    
    const combined = [...originalFiles, ...valid];
    updateFiles(combined);
    onUploadComplete?.(combined);
  };

  const handleDelete = (idx) => {
    // Reset input value to allow re-uploading same file after deletion
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (!multiple) {
      updateFiles(null);
      externalOnDelete?.(idx);
      return;
    }

    // Get original files (with string paths for existing files)
    const formValue = isUsingForm ? methods.getValues(name) : (filesProp || internalFiles);
    const originalFiles = Array.isArray(formValue) ? formValue : formValue ? [formValue] : [];
    
    const newList = [...originalFiles];
    newList.splice(idx, 1);
    updateFiles(newList);

    // Clear preview URL for the deleted file
    setPreviewUrls(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[idx];
      const reindexed = {};
      Object.entries(newPreviews).forEach(([key, value], i) => {
        reindexed[i] = value;
      });
      return reindexed;
    });

    // Clear upload states for the deleted file
    setUploadStates(prev => {
      const newStates = { ...prev };
      delete newStates[idx];
      const reindexed = {};
      Object.entries(newStates).forEach(([key, value], i) => {
        reindexed[i] = value;
      });
      return reindexed;
    });

    externalOnDelete?.(idx);
  };

  // Extract per-file errors from form validation
  const validationErrors = useMemo(() => {
    let errors = extractFileErrors(error);
    
    // Also try to get errors directly from form state if using form context
    const formErrors = methods?.formState?.errors;
    if (isUsingForm && formErrors && name) {
      const fieldErrors = formErrors[name];
      
      // Handle different error structures
      if (fieldErrors) {
        // If fieldErrors is an array of errors for each file
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((err, index) => {
            if (err && err.message) {
              errors[index] = err.message;
            }
          });
        }
        // If fieldErrors has numbered properties (0, 1, 2, etc.)
        else if (typeof fieldErrors === 'object') {
          Object.entries(fieldErrors).forEach(([key, err]) => {
            const index = parseInt(key);
            if (!isNaN(index) && err && err.message) {
              errors[index] = err.message;
            }
          });
        }
        // If it's a general error with message
        else if (fieldErrors.message) {
          // This would be a general error, not per-file
          // We can handle this in the general error display
        }
      }
    }
    
    return errors;
  }, [error, isUsingForm, methods?.formState?.errors, name]);
  
  const hasFiles = multiple ? currentFiles?.length > 0 : currentFiles != null;
  
  return (
    <>
      {label && (
        <div className="mb-1.5 flex items-center">
          <label className="text-md">{label}</label>
          {required && <span className="ml-1 text-danger-normal">*</span>}
        </div>
      )}
      <div className="mb-2">
        {!hasFiles ? (
          <div 
            ref={dropZoneRef}
            className={cn(
              "w-full rounded-lg bg-white border p-4 flex justify-between items-center transition-all duration-200",
              disabled 
                ? "border-gray-200 opacity-50 pointer-events-none" 
                : cn(
                    "cursor-pointer",
                    isDragOver 
                      ? "border-primary-normal bg-primary-soft/20 border-2 border-dashed" 
                      : "border-gray-300 hover:border-primary-normal"
                  )
            )} 
            onClick={() => inputRef.current?.click()} 
            onDragEnter={handleDragEnter} 
            onDragLeave={handleDragLeave} 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded transition-all duration-200", 
                disabled 
                  ? "bg-gray-200" 
                  : isDragOver 
                    ? "bg-primary-normal" 
                    : "bg-primary-soft"
              )}>
                {type === "image" ? (
                  <ImageIcon 
                    size={16} 
                    className={isDragOver && !disabled ? "text-white" : ""} 
                  />
                ) : (
                  <Upload 
                    size={16} 
                    className={isDragOver && !disabled ? "text-white" : ""} 
                  />
                )}
              </div>
              <div>
                <p className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isDragOver && !disabled ? "text-primary-normal" : "text-primary-normal"
                )}>
                  {isDragOver ? `Drop ${type === "image" ? "images" : "files"} here` : `Click or drag ${type === "image" ? "images" : "file"} to this area`}
                </p>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const allowedExtensions = extensions.length > 0 ? extensions : 
                      (type === "image" ? ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico'] : ['docx', 'pdf', 'pptx', 'ppt']);
                    return allowedExtensions.map(ext => ext.toUpperCase()).join(', ');
                  })()} (max {formatSize(maxBytes).replace('.00', '')})
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-lg bg-white border border-gray-200 p-4">
            {multiple ? (
              <div className="flex items-start space-x-3 w-full">
                <div className="p-2 bg-primary-soft rounded">
                  {type === "image" ? (
                    <ImageIcon className="text-primary-normal" size={16} />
                  ) : (
                    <Upload className="text-primary-normal" size={16} />
                  )}
                </div>
                <div className="flex-1 w-full">
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    {currentFiles.length} {type === "image" ? "images" : "files"} selected
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-3 w-full">
                    {currentFiles.map((file, idx) => {
                      const fileError = generalErrors[idx] || validationErrors[idx];
                      return (
                        <div key={`${file.name}-${idx}`} className="flex flex-col w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                                                 <p className="text-sm font-bold truncate text-primary-normal">
                                   {file.name} 
                                   {file?.isExistingFile ? (
                                     <span className="text-xs text-gray-500">(existing file)</span>
                                   ) : (
                                     <span className="text-xs text-gray-500"> {formatSize(file.size)}</span>
                                   )}
                                 </p>
                                {fileError && <p className="text-xs text-danger-normal mt-0.5">{fileError}</p>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Trash2 className="cursor-pointer hover:text-danger-normal" onClick={() => handleDelete(idx)} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn("space-y-3")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FilePreview type={type} file={currentFiles} previewUrl={previewUrls[0]} isLoading={uploadStates[0] === "progress"} multiple={multiple} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-primary-normal font-bold">{currentFiles.name}</p>
                      {currentFiles?.isExistingFile ? (
                        <p className="text-xs text-gray-500">(existing file)</p>
                      ) : (
                        <p className="text-xs text-gray-500">{formatSize(currentFiles.size)}</p>
                      )}
                      {(generalErrors[0] || validationErrors[0]) && <p className="text-xs text-danger-normal mt-0.5">{generalErrors[0] || validationErrors[0]}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trash2 className="cursor-pointer hover:text-danger-normal" onClick={() => handleDelete(0)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden file input */}
        <input 
          ref={inputRef}
          id={name}
          type="file" 
          accept={getAcceptAttribute()}
          multiple={multiple} 
          disabled={disabled} 
          className="hidden" 
          onChange={e => handleFiles(Array.from(e.target.files))}
        />
        
        {/* Show general errors from file validation */}
        {Object.keys(generalErrors).length > 0 && !hasFiles && (
          <div className="mt-2">
            {Object.values(generalErrors).map((errorMsg, idx) => (
              <p key={idx} className="text-sm text-danger-normal">{errorMsg}</p>
            ))}
          </div>
        )}
        
        {/* Only show general error if it's not file-specific */}
        {error && !Object.keys(validationErrors).length && <p className="text-sm text-danger-normal mt-1">{error.message}</p>}
      </div>
    </>
  );
});