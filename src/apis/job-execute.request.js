import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const jobExecuteApi = {
    createJobExecute: (data) => {
        const token = getToken();
        return API.post('/executes/job-execute', data, {
            headers: { authorization: `Bearer ${token}` },
        });
    },
    getJobExecuteByJobPostingId: (id) => {
        const token = getToken();
        return API.get(`/executes/job-execute/job-posting/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        })
    },
    updateJobExecute: (id, data) => {
        const token = getToken();
        return API.patch(`/executes/job-execute/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        });
    },
    deleteJobExecute: (id) => {
        const token = getToken();
        return API.delete(`/executes/job-execute/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        })
    }
};