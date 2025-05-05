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

    getPaymentHistory: () => {
        const token = getToken();
        return API.get("/payment/paymentHistory", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },

    getEscrowWallet: () => {
        const token = getToken();
        return API.get("/payment/escrowWallet", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },

    getTransactions: () => {
        const token = getToken();
        return API.get("/transactions/", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },

    releasePayment: (data) => {
        const token = getToken();
        return API.post("/payment/release", data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
}