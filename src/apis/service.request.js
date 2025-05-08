import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const serviceApi = {
    createService: (data) => {
        return API.post("/service/services/create", data);
    },

    getServices: () => {
        return API.get("/service/services/");
    },
    updateService: (id, data) => {
        return API.put(`/service/services/${id}`, data);
    },
    deleteService: (id) => {
        return API.delete(`/service/services/${id}`);
    },
}