import { jobPostingApi } from "../../apis/job-posting.request";
import actionType from "./action.type";

export const getJobPostingByJGId = (jobGroupId) => async (dispatch) => {
    dispatch({ type: actionType.JOB_POSTING_START })
    try {
        const response = await jobPostingApi.getAllJobByJobGroupId(jobGroupId);    
        dispatch({ type: actionType.JOB_POSTING_GET_BY_JOBGROUP_ID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionType.JOB_POSTING_FAIL, payload: error.response.data });
    }
}