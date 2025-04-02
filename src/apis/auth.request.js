import { Api } from "../utils/BaseUrlServer";
import { removeLocalstorage } from "../utils/Localstorage";

const API = Api();
export const login = (data) => {
  return API.post("/auth/login", data);
};

export const register = (data) => {
  return API.post("/auth/register", data);
};

export const logout = (userToken) => {
  removeLocalstorage(userToken);
}
