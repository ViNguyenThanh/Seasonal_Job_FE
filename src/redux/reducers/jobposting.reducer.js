import actionType from "../actions/action.type";

export const jobPostingReducer = (
    state = { isLoading: false, error: "", payload: null },
    action) => {
    const { type, payload } = action;
    switch (type) {
        case actionType.JOB_POSTING_START:
            return { isLoading: true, error: "", payload: null };
        case actionType.JOB_POSTING_GET_BY_JOBGROUP_ID_SUCCESS:
            console.log(payload.data);
            
            return { isLoading: false, error: "", payload: payload.data };
        case actionType.JOB_POSTING_FAIL:
            return { isLoading: false, error: payload, payload: null };
        default:
            return state;
    }
}