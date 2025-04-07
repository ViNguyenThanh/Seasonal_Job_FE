import { jobGroupApi } from "../../apis/job-group.request";
import actionType from "./action.type";

export const getAllJobGroups = (start_date, end_date) => async (dispatch) => {
    dispatch({ type: actionType.JOBGROUPS_START })
    try {
        const response = await jobGroupApi.getAllJobGroups(start_date, end_date);    
        dispatch({ type: actionType.JOBGROUPS_GETALL_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionType.JOBGROUPS_FAIL, payload: error.response.data });
    }
}

export const getAllJobGroupsByUserId = () => async (dispatch) => {
    dispatch({ type: actionType.JOBGROUPS_START })
    try {
        const response = await jobGroupApi.getAllJobGroupsByUserId();    
        dispatch({ type: actionType.JOBGROUPS_GET_ALL_BY_USERID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionType.JOBGROUPS_FAIL, payload: error.response.data });
    }
}

export const getJobGroupById = (id) => async (dispatch) => {
    dispatch({ type: actionType.JOBGROUPS_START })
    try {
        const response = await jobGroupApi.getJobGroupById(id);    
        dispatch({ type: actionType.JOBGROUPS_GET_BY_ID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionType.JOBGROUPS_FAIL, payload: error.response.data });
    }
}
