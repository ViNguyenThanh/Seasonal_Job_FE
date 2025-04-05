import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const jobApi = {
    getAllJobs: () => {
        const token = getToken();
        return API.get('/jobs', {
            headers: { authorization: `Bearer ${token}` },
        });
    },
    getJobById: (id) => {
        const token = getToken();
        return API.get(`/jobs/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        });
    },
    createJob: (data) => {
        const token = getToken();
        return API.post('/jobs', data, {
            headers: { authorization: `Bearer ${token}` },
        });
    },
    createJobType: (data) => {
        const token = getToken();
        return API.post('/jobs/jobType', data, {
            headers: { authorization: `Bearer ${token}` },
        });
    },
};