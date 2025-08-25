import mainInstance from "@/api/instances/main.instance";

export const getFile = (data) => mainInstance.get('/file', { params: { pathfile: data } }).then(res => res);

export const getPresignedUrl = (pathfile) => mainInstance.get('/file/url', { params: { pathfile } }).then(res => res.data);

const getFileS3 = async ({ folder, filename, aliasedFilename }) => {
  try {
    const params = {
      path: folder,
      filename: filename,
    };

    const key = Buffer.from(
      Buffer.from(JSON.stringify(params)).toString("hex")
    ).toString("base64");
    const url = `/general/s3/${key}/${aliasedFilename ? aliasedFilename : filename
      }`;

    const response = await mainInstance.get(url);
    const { success, data, message } = response?.data;

    if (success) {
      return { success, data, message };
    } else {
      return { success, error: data, message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export const uploadFile = async (formData) => {
  try {
    return await mainInstance.post('/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export const uploadFileChunk = async (formData) => {
  try {
    return await mainInstance.post('/file/chunk', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export const composeFile = async (formData) => {
  try {
    return await mainInstance.post('/file/compose', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error) {
    console.error(error);
    return { success: false, error, message: error.message };
  }
};

export default {
  getFile,
  getFileS3,
  uploadFile,
  uploadFileChunk,
  composeFile,
};
