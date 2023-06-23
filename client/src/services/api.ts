import axios from "axios";
import baseURL from "../config/baseURL";

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

export default api;