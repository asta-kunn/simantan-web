import { Button } from "@/components/Dexain";
import {
  composeFile as composeFileService,
  getFile as getFileService,
  uploadFileChunk as uploadFileChunkService,
  uploadFile as uploadFileService
} from "@/services/general.service";
import { useUIStore } from "@/stores/uiStore";
import { Download } from "lucide-react";
import { useCallback } from "react";
import { utils, write } from "xlsx";

/**
 * useFile - Global hook for file operations (preview, download, upload)
 * Usage:
 *   const { previewFile, downloadFile, uploadFile } = useFile();
 *   <Button onClick={() => previewFile(fileUrl)} />
 *   <Button onClick={() => downloadFile(fileUrl)} />
 *
 *   // For upload:
 *   const handleUpload = async () => {
 *     const result = await uploadFile({
 *       file: myFile,
 *       fileName: "document-name",
 *       docType: "DOCUMENT_TYPE"
 *     });
 *     if (result.success) {
 *       console.log("File uploaded:", result.data);
 *     }
 *   }
 *  // For generating Excel files:
 *  const { generateExcelFile } = useFile();
 * generateExcelFile(data, "export.xlsx", (arr) => arr.join("\n"));
 * This hook provides methods to:
 * - Preview files in a modal
 * - Download files
 */

export const useFile = () => {
  const { addStack, closeStack, setLoader, openProgressModal, setProgress, closeProgressModal } = useUIStore();

  const getFileExtension = (filename = "") => {
    return filename.split(".").pop().toLowerCase();
  };

  const getFileName = (fileUrl) => {
    if (!fileUrl) return "";
    try {
      return decodeURIComponent(fileUrl.split("/").pop());
    } catch {
      return fileUrl;
    }
  };

  const flattenNestedObject = (obj, options = {}) => {
    const result = {};

    const recurse = (curr, prefix = "") => {
      for (const key in curr) {
        const value = curr[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (Array.isArray(value)) {
          result[newKey] = options.arrayFormatter
            ? options.arrayFormatter(value)
            : value.join("\n");
        } else if (
          value &&
          typeof value === "object" &&
          !(value instanceof Date)
        ) {
          recurse(value, newKey);
        } else {
          result[newKey] = value;
        }
      }
    };

    recurse(obj);
    return result;
  };

  const previewFile = useCallback(
    async (fileUrl, fileName = null) => {
      const fileExt = fileUrl.split(".").pop().toLowerCase();

      let stackId;

      try {
        setLoader(true);
        const data = await getFileService(fileUrl);

        // Case: If the file is a presigned URL string
        if (typeof data === "string") {
          const url = data;
          const downloadName = fileName
            ? `${fileName}.${getFileExtension(fileUrl)}`
            : getFileName(fileUrl);

          const downloadInternal = () => {
            const link = document.createElement("a");
            link.href = url;
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }

          stackId = addStack({
            size: "3xl",
            closable: true,
            title: downloadName,
            content: (
              <div className="flex items-center justify-center h-48">
                <div className="flex flex-col items-center space-y-4 py-2 w-full">
                  <div>
                    <div className="text-lg font-medium text-center">
                      Couldn&apos;t preview the file
                    </div>
                    <div className="text-gray-400 text-sm text-center">
                      File may be too large to preview. Try downloading instead.
                    </div>
                  </div>
                  <div>
                    <Button onClick={downloadInternal}>
                      <Download className="w-4 h-4" /> Download File
                    </Button>
                  </div>
                </div>
              </div>
            ),
            onClose: () => {
              URL.revokeObjectURL(url);
              closeStack(stackId);
            },
          });

          return;
        }

        const byteArray = new Uint8Array(data.data);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // Update the modal with the loaded content
        stackId = addStack({
          type: "modal",
          size: fileExt === "pdf" ? "5xl" : "2xl",
          closable: true,
          title: fileName || getFileName(fileUrl),
          content: (
            <>
              {fileExt === "pdf" ? (
                <div className="w-full h-[calc(100vh-100px)]">
                  <iframe
                    src={url}
                    title="File Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2 py-2 w-full">
                    <div>
                      <div className="text-lg font-medium text-center">
                        No preview available for this file type
                      </div>
                      <div className="text-gray-400 text-sm text-center">
                        You can download the file to view it in an another
                        application
                      </div>
                    </div>
                    <div>
                      <Button onClick={() => downloadFile(fileUrl, fileName)}>
                        <Download className="w-4 h-4" /> Download File
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ),
          onClose: () => {
            URL.revokeObjectURL(url);
            closeStack(stackId);
          },
        });

        return url;
      } catch (err) {
        console.error("Error previewing file:", err);

        addStack({
          title: "Error",
          content: <div>Error previewing file: {err.message}</div>,
        });
        return null;
      } finally {
        setLoader(false);
      }
    },
    [addStack, closeStack]
  );

  const downloadFile = useCallback(
    async (fileUrl, fileName = null) => {
      setLoader(true);

      try {
        const data = await getFileService(fileUrl);
        const byteArray = new Uint8Array(data.data);
        const blob = new Blob([byteArray]);
        const url = URL.createObjectURL(blob);
        const downloadName = fileName
          ? `${fileName}.${getFileExtension(fileUrl)}`
          : getFileName(fileUrl);

        // Create a temporary link to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL after download
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading file:", err);
        addStack({
          title: "Error",
          content: <div>Error downloading file: {err.message}</div>,
        });
      } finally {
        setLoader(false);
      }
    },
    [addStack, setLoader]
  );

  const uploadFile = useCallback(
    async ({ file, fileName, docType, versioning = "N" }) => {
      try {
        const formData = new FormData();
        formData.append("PATH", docType);
        formData.append("FILE", file);
        formData.append("FILENAME", fileName);
        formData.append("VERSIONING", versioning);

        // Direct API call instead of returning a mutation
        const data = await uploadFileService(formData);
        return {
          filePath: data.objectName,
          version: data.version,
        };
      } catch (err) {
        console.error("Error uploading file:", err);
        addStack({
          title: "Error",
          content: <div>Error uploading file: {err.message}</div>,
        });
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [addStack]
  );

  async function executeWithConcurrency(tasks, maxConcurrent) {
    const executing = [];

    for (const task of tasks) {
      const promise = task().then(() => {
        executing.splice(executing.indexOf(promise), 1);
      });

      executing.push(promise);

      if (executing.length >= maxConcurrent) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
  }

  const getOptimalChunkSize = (fileSize) => {
    // For files under 50MB: 3MB chunks
    if (fileSize < 50 * 1024 * 1024) return { size: 3 * 1024 * 1024, concurrent: 15 };
    // For files 50MB-500MB: 5MB chunks
    if (fileSize < 500 * 1024 * 1024) return { size: 5 * 1024 * 1024, concurrent: 12 };
    // For files over 500MB: 7MB chunks
    return { size: 7 * 1024 * 1024, concurrent: 10 };
  };

  const uploadFileChunk = useCallback(
    async ({ file, fileName, docType, versioning = "N" }) => {
      const { size: CHUNK_SIZE, concurrent: MAX_CONCURRENT_UPLOADS } = getOptimalChunkSize(file.size);
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uploadId = `${docType}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      try {
        let completedChunks = 0;
        const uploadPromises = [];

        openProgressModal();

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = start + CHUNK_SIZE;
          const chunk = file.slice(start, end);

          const formData = new FormData();
          formData.append("PATH", docType);
          formData.append("FILE", chunk);
          formData.append("UPLOAD_ID", uploadId);
          formData.append("FILENAME", fileName);
          formData.append("CHUNK_INDEX", i.toString());

          uploadPromises.push(async () => {
            await uploadFileChunkService(formData);
            completedChunks++;
            setProgress(Math.round(((completedChunks - Math.random() * 0.9 + 0.1) / totalChunks) * 100));
          });
        }

        await executeWithConcurrency(uploadPromises, MAX_CONCURRENT_UPLOADS);

        const formData = new FormData();
        formData.append("PATH", docType);
        formData.append("UPLOAD_ID", uploadId);
        formData.append("FILENAME", fileName);
        formData.append("VERSIONING", versioning);

        const data = await composeFileService(formData);
        closeProgressModal();

        return { filePath: data.objectName, version: data.version };
      } catch (err) {
        closeProgressModal(); // Make sure to close modal on error
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [openProgressModal, setProgress, closeProgressModal]
  );

  const generateExcelFile = useCallback(
    (data, fileName = "export.xlsx", arrayFormatter) => {
      try {
        setLoader?.(true);

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data provided for Excel export.");
          return;
        }

        const transformedData = data.map((item) => {
          const flat = flattenNestedObject(item, { arrayFormatter });

          const filtered = Object.keys(flat).reduce((acc, key) => {
            // Exclude any key that ends in "_ID" or is "ID"
            if (!/(_ID|^ID)$/i.test(key)) {
              // Handle array of strings processing
              let value = flat[key];

              // Check if value is an array of strings
              if (Array.isArray(value)) {
                // Use custom arrayFormatter if provided, otherwise use default formatting
                if (arrayFormatter && typeof arrayFormatter === 'function') {
                  value = arrayFormatter(value, key);
                } else {
                  // Default formatting for array of strings
                  value = value
                    .filter(item => item !== null && item !== undefined && item !== '') // Remove empty values
                    .map(item => String(item).trim()) // Convert to string and trim
                    .join(', '); // Join with comma and space
                }
              }
              // Handle nested objects that might contain arrays
              else if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
              }
              // Handle null/undefined values
              else if (value === null || value === undefined) {
                value = '';
              }

              acc[key] = value;
            }
            return acc;
          }, {});

          return filtered;
        });

        const worksheet = utils.json_to_sheet(transformedData);

        // Auto column widths with better handling for array content
        const columnWidths = Object.keys(transformedData[0]).map((key) => {
          const maxLength = Math.max(
            key.length,
            ...transformedData.map((row) => {
              if (row[key] === null || row[key] === undefined) return 0;
              return String(row[key]).length;
            })
          );

          return {
            wch: Math.min(maxLength + 2, 50), // Add padding and cap at 50
          };
        });
        worksheet["!cols"] = columnWidths;

        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = write(workbook, {
          bookType: "xlsx",
          type: "array",
          cellStyles: true,
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return {
          success: true,
          message: "Excel file generated successfully"
        };
      } catch (err) {
        console.error("Error generating excel file:", err);
        addStack({
          title: "Error",
          content: <div>Error generating excel file: {err.message}</div>,
        });
        return {
          success: false,
          error: err.message,
        };
      } finally {
        setLoader?.(false);
      }
    },
    [addStack, setLoader]
  );
  return {
    previewFile,
    downloadFile,
    uploadFile,
    uploadFileChunk,
    generateExcelFile,
  };
};
