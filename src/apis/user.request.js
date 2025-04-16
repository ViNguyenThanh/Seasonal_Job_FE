import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";
const API = Api()

export const userApi = {
    updateUserProfile: (id, data) => {
        const token = getToken()
        return API.put(`/users/update/${id}`, data, {
            headers: { authorization: `Bearer ${token}` },
        })
    },
    getUserById: (id) => {
        const token = getToken()
        return API.get(`/users/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        })
    },
    getUserCompanies: () => {
        return API.get(`/users/companies`);
    },
}