import { jobGroupApi } from "../../apis/job-group.request";
import actionsType from "./action.type";

export const getAllJobGroups = (start_date, end_date) => async (dispatch) => {
    dispatch({ type: actionsType.JOBGROUPS_START })
    try {
        const response = await jobGroupApi.getAllJobGroups(start_date, end_date);    
        dispatch({ type: actionsType.JOBGROUPS_GETALL_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionsType.JOBGROUPS_FAIL, payload: error.response.data });
    }
}

export const getAllJobGroupsByUserId = () => async (dispatch) => {
    dispatch({ type: actionsType.JOBGROUPS_START })
    try {
        const response = await jobGroupApi.getAllJobGroupsByUserId();    
        dispatch({ type: actionsType.JOBGROUPS_GET_ALL_BY_USERID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: actionsType.JOBGROUPS_FAIL, payload: error.response.data });
    }
}
