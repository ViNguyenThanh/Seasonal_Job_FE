import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const reviewApi = {
    createReview: (data) => {
        return API.post("/reviews/create", data);
    },

    getReviews: () => {
        const token = getToken();
        return API.get("/reviews/", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
}