import actionType from "../actions/action.type";

export const jobGroupsReducer = (
    state = { isLoading: false, error: "", payload: null },
    action) => {
    const { type, payload } = action;
    switch (type) {
        case actionType.JOBGROUPS_START:
            return { isLoading: true, error: "", payload: null };
        case actionType.JOBGROUPS_GETALL_SUCCESS:
            return { isLoading: false, error: "", payload: payload };
        case actionType.JOBGROUPS_GET_ALL_BY_USERID_SUCCESS:
            return { isLoading: false, error: "", payload: payload.data };
        case actionType.JOBGROUPS_FAIL:
            return { isLoading: false, error: payload, payload: null };
        default:
            return state;
    }
}