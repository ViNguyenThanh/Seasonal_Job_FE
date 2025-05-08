import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const complaintApi = {
    createComplaint: (data) => {
        const token = getToken();
        return API.post("/complaints/", data, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        });
    },

    getComplaints: (data) => {
        const token = getToken();
        return API.get("/complaints/", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },

    getComplaintById: (id) => {
        const token = getToken();
        return API.get(`/complaints/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },

    updateComplaint: (id, data) => {
        const token = getToken();
        return API.put(`/complaints/${id}`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
}