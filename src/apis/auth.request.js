import { Api } from "../utils/BaseUrlServer";

const API = Api();

export const authApi = {
  register: (data) => {
    return API.post('/auth/register', data)
  },
  login: (data) => {
    return API.post('/auth/login', data)
  },
  verifyEmail: (token) => {
    return API.get(`/auth/verify-email?token=${token}`)
  },
}
