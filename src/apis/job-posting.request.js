import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();


export const jobPostingApi = {
    createJobPosting: (data) => {
        const token = getToken();
        return API.post("/jobs/", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
    getAllJobByJobGroupId: (jobGroupId) => {
        return API.get(`/jobs/job-groups/${jobGroupId}`)
    }
}