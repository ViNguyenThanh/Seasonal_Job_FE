import axios from "axios";

export const Api = () => {
  return axios.create({
    baseURL: "http://localhost:3000/api",
    // baseURL: 'https://sjcp-fha4a5e8f6arc7cg.eastasia-01.azurewebsites.net/api'
  });
};
