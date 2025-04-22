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

  formData.append("file", file);

  try {
    console.log("Uploading file:", file); // Log the file being uploaded
    const response = await API.post("/cvs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", response.data); // Log the server response
    return response.data; // Return only the response data
  } catch (error) {
    console.error("Error uploading CV:", error.response?.data || error.message); // Log backend error details
    throw error;
  }
};

export const cvApi = {
  /**
   * Apply for a job posting
   * @param {string} jobpostingId - The ID of the job posting
   * @param {Object} data - The application data
   * @returns {Promise} - The API response
   */
  applyjob: async (jobpostingId, data) => {
    const token = getToken();
    try {
      const response = await API.post(`/cvs/job/${jobpostingId}/apply`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get all CVs for a user
   * @param {string} userId - The ID of the user
   * @returns {Promise} - The API response
   */
  getUserCVs: async (userId) => {
    const token = getToken();
    try {
      const response = await API.get(`/cvs/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user CVs:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
 * Set a CV as the default
 * @param {string} userId - The ID of the user
 * @param {string} cvId - The ID of the CV
 * @returns {Promise} - The API response
 */
  setDefaultCV: async (userId, cvId) => {
    const token = getToken();
    if (!userId || !cvId) {
      throw new Error("userId and cvId are required");
    }

    try {
      const response = await API.put(`/cvs/${userId}/${cvId}/set-default`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error setting default CV:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Preview a CV
   * @param {string} cvId - The ID of the CV
   * @returns {Promise} - The API response containing the CV preview details
   */
  previewCV: async (cvId) => {
    const token = getToken();
    if (!cvId) {
      throw new Error("cvId is required");
    }

    try {
      const response = await API.get(`/cvs/${cvId}/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error previewing CV:", error.response?.data || error.message);
      throw error;
    }
  },

  uploadCV,
};