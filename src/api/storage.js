// src/api/storage.js
import mainInstance from "@/api/instances/main.instance";

/**
 * Normalize whatever the Uploader component hands back into a real File/Blob.
 * Dexain's Uploader may pass a File, a FileList, an array, a change event, or a
 * wrapper object like { file } / { originFileObj } depending on the version.
 */
export const normalizeFile = (input) => {
  if (!input) return null;

  // Already a File/Blob
  if (typeof Blob !== "undefined" && input instanceof Blob) return input;

  // Change event
  if (input?.target?.files) return input.target.files[0] || null;

  // FileList
  if (typeof FileList !== "undefined" && input instanceof FileList) return input[0] || null;

  // Array of files or wrappers
  if (Array.isArray(input)) return normalizeFile(input[0]);

  // Common wrapper shapes
  const wrapped = input.file ?? input.originFileObj ?? input.raw ?? input.blob;
  if (wrapped && wrapped !== input) return normalizeFile(wrapped);

  return null;
};

/**
 * Upload one real file to Google Cloud Storage (bucket: simantan) via the API.
 * Returns the object path to store in the database, e.g.
 *   "laporan/APBN/POK-01/PEMANFAATAN/1733120000000-uuid.pdf"
 *
 * @param {File|FileList|Event|{file: File}} fileInput
 * @param {string} folder - allowed roots: laporan/, usulan-cpcl/, pengaduan/
 * @returns {Promise<{path: string, contentType: string, size: number, originalName: string}>}
 */
export const uploadFile = async (fileInput, folder) => {
  const file = normalizeFile(fileInput);

  if (!file) {
    throw new Error(
      "File tidak valid: yang diterima bukan File/Blob. Periksa nilai dari onChange Uploader."
    );
  }
  if (!file.size) throw new Error("File kosong (0 byte).");

  const formData = new FormData();
  // Third argument keeps the filename, which the backend uses for the extension check.
  formData.append("file", file, file.name || "upload");
  formData.append("folder", folder);

  const res = await mainInstance.post("/storage/upload", formData, {
    headers: {
      // Delete the instance-level JSON default so the browser can set
      // multipart/form-data with its own boundary.
      "Content-Type": undefined,
    },
    // Request-level transformRequest overrides the instance default. Without
    // this, an instance that JSON.stringify's every body turns the FormData
    // into {"file":{},"folder":"..."} and the file never leaves the browser.
    transformRequest: [(data) => data],
  });

  return res?.data ?? res;
};

/** Upload several files at once. Pass { file, folder } pairs; null entries are skipped. */
export const uploadFiles = async (items = []) => {
  const jobs = items
    .filter((it) => it?.file)
    .map(async (it) => ({ key: it.key, ...(await uploadFile(it.file, it.folder)) }));

  const results = await Promise.all(jobs);

  return results.reduce((acc, r) => {
    acc[r.key] = r.path;
    return acc;
  }, {});
};

/** Expiring direct GCS link. Good for "open in new tab" / <a download>. */
export const getSignedUrl = async (path, minutes = 15) => {
  const res = await mainInstance.get("/storage/signed-url", { params: { path, minutes } });
  return (res?.data ?? res)?.url;
};

/**
 * Fetch the object as a Blob through the API (streamed by the backend).
 * Preferred for previews: same origin as the API, so bucket CORS is not needed.
 */
export const fetchFileBlob = async (path) => {
  const res = await mainInstance.get("/storage/file", {
    params: { path },
    responseType: "blob",
  });
  return res?.data instanceof Blob ? res.data : res;
};

/** Blob wrapped as a File — FilePreview expects a File. */
export const fetchAsFile = async (path, fallbackName = "file") => {
  const blob = await fetchFileBlob(path);
  const name = String(path || fallbackName).split("/").pop() || fallbackName;
  return new File([blob], name, { type: blob.type || "application/octet-stream" });
};

/** Filename only, for showing an already-uploaded document in the Uploader. */
export const fileNameOf = (path) => (path ? String(path).split("/").pop() : undefined);

export const deleteFile = (path) => mainInstance.delete("/storage", { params: { path } });