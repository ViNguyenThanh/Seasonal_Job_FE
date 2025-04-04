import actionType from "../actions/action.type";

export const authReducer = (
    state = { isLoading: false, error: "", payload: null },
    action) => {
    const { type, payload } = action;
    switch (type) {
        case actionType.AUTH_START:
            return { isLoading: true, error: "", payload: null };
        case actionType.AUTH_LOGIN_SUCCESS:
            localStorage.setItem("token", JSON.stringify(payload.token));
            return { isLoading: false, error: "", payload: payload };
        case actionType.AUTH_FAIL:
            return { isLoading: false, error: payload, payload: null };
        case actionType.AUTH_LOGOUT:
            localStorage.removeItem("token");
            return { isLoading: false, error: "", payload: null };
        default:
            return state;
    }
}