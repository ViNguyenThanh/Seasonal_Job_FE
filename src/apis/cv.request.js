import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

/**
 * Upload a CV file
 * @param {File} file - The CV file to upload
 * @returns {Promise} - The API response
 */
export const uploadCV = async (file) => {
  const token = getToken();
  const formData = new FormData();

  // Add the file to the form data
  formData.append("file", file);

  // Add the required fields to the form data
  formData.append("file_Id", "some_unique_id"); // Replace with actual file ID logic
  formData.append("file_Url", "http://example.com/file_url"); // Replace with actual file URL logic
  formData.append("filename", file.name); // Use the file's name

  try {
    console.log("Uploading file:", file); // Log the file being uploaded
    const response = await API.post("/cvs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload response:", response); // Log the server response
    return response.data;
  } catch (error) {
    console.error("Error uploading CV:", error.response || error.message);
    throw error;
  }
};