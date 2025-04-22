import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const jobGroupApi = {
    createJobGroup: (data) => {
        const token = getToken()
        return API.post("/jobGroups/", data,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    getAllJobGroups: (start_date, end_date) => {
        return API.get(`/jobGroups/jobGroups?start_date=${start_date}&end_date=${end_date}`);
    },
    getAllJobGroupsByUserId: () => {
        const token = getToken();
        return API.get('/jobGroups/', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    },
    getJobGroupById: (id) => {
        return API.get(`/jobGroups/${id}`)
    },
    updateJobGroup: (id, data) => {
        const token = getToken();
        return API.post(`/jobGroups/jobGroups/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    },
    getAllJobGroupsInactive: (start_date = '', end_date = '') => {
        return API.get(`jobGroups/jobGroupsInactive?start_date=${start_date}&end_date=${end_date}`);
    },
};