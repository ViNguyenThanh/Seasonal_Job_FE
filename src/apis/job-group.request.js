import { Api } from "../utils/BaseUrlServer";
import { getToken } from "../utils/Token";

const API = Api();

export const jobGroupApi = {
    createJobGroup: (data) => {
        const token = getToken()
        return API.post("/jobGroups/", data,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    }
};