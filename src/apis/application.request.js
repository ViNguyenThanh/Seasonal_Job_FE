import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

/**
 * Get applications by user ID
 * @returns {Promise} - The API response or an empty array on failure
 */
export const getApplicationsByUserId = async () => {
    const token = getToken();
    try {
        const response = await API.get("/applications/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching applications by user ID:", error.response || error.message);
        return { data: [] }; // Return an empty array as a fallback
    }
};

/**
 * Get applications for a specific job
 * @param {number} jobPostingId - The job posting ID
 * @returns {Promise} - The API response
 */
export const getApplicationsForJob = async (jobPostingId) => {
    const token = getToken();
    try {
        const response = await API.get(`/applications/job/${jobPostingId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching applications for job:", error.response || error.message);
        throw error;
    }
};

export const updateApplicationStatus = async (applicationId, status) => {
    const token = getToken();
    try {
        const response = await API.put(`/applications/${applicationId}/status`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error.response || error.message);
        throw error;
    }
}