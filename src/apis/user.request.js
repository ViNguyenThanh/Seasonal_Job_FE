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
    getPublicUserById: (id) => {
        return API.get(`/users/public/${id}`);
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
    getAllUsers: () => {
        const token = getToken()
        return API.get('/users/all', {
            headers: { authorization: `Bearer ${token}` },
        })
    },
    resetPassword: (data) => {
        return API.post(`/users/reset-password`, data)
    },
    forgetPassword: (data) => {
        return API.post(`/users/forget-password`, data)
    },
    getTotalAccounts: () => {
        const token = getToken()
        return API.get('/users/totalAccounts', {
            headers: { authorization: `Bearer ${token}` },
        })
    },
    banUser: (id) => {
        const token = getToken()
        return API.delete(`/users/delete/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        })
    },
}