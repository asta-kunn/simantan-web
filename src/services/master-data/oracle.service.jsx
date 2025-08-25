import mainInstance from "@/api/instances/main.instance";

const getFileS3 = async ({ folder, filename, aliasedFilename }) => {
  try {
    const params = {
      path: folder,
      filename: filename,
    };

    const key = Buffer.from(
      Buffer.from(JSON.stringify(params)).toString("hex")
    ).toString("base64");
    const url = `/general/s3/${key}/${
      aliasedFilename ? aliasedFilename : filename
    }`;

    const response = await mainInstance.get(url);
    console.log({ response });
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

export default {
  getFileS3,
};
