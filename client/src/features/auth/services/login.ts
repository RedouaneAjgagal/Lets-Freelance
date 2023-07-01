import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api";

type Login = {
    email: string;
    password: string;
}

const loginRequest = async (payload: Login): Promise<AxiosResponse<{ msg: string }>> => {
    const response = await postRequest("auth/login", payload);
    return response;
}

export default loginRequest;