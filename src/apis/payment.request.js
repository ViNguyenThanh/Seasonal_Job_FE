import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const paymentApi = {
    createPayment: (data) => {
        const token = getToken();
        return API.post("/payment/create", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
}