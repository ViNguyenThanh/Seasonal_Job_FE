import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { jobGroupsReducer } from "./jobgroups.reducer";
import { jobPostingReducer } from "./jobposting.reducer";

export const reducers = combineReducers ({
    authReducer,
    jobGroupsReducer,
    jobPostingReducer
})