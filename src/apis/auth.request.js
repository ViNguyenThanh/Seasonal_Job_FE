import { Api } from "../utils/BaseUrlServer";
import { removeLocalstorage } from "../utils/Localstorage";

const API = Api();

export const authApi = {
  register: (data) => {
    return API.post('/auth/register', data)
  },
  login: (data) => {
    return API.post('/auth/login', data)
  }
}
