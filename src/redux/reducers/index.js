import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { jobGroupsReducer } from "./jobgroups.reducer";

export const reducers = combineReducers ({
    authReducer,
    jobGroupsReducer
})