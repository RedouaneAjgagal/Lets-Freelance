import axios from "axios";
import baseURL from "../config/baseURL";

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

export const getRequest = async (URL: string) => {
    return await api.get(`/${URL}`);
}

export const postRequest = async (URL: string, payload: unknown) => {
    return await api.post(`/${URL}`, payload);
}
export const patchRequest = async (URL: string, payload: unknown) => {
    return await api.patch(`/${URL}`, payload);
}
export const deleteRequest = async (URL: string) => {
    return await api.delete(`/${URL}`);
}

// api.interceptors.response.use(function (response) {
//     //Dispatch any action on success
//     return response;
//   }, function (error) {
//       if(error.response.status === 400) {


//        //Add Logic to 
//              //1. Redirect to login page or 
//              //2. Request refresh token
//       }
//     return Promise.reject(error);
//   });

export default api;