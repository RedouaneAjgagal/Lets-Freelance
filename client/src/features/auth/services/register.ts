import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

type Register = {
    name: string;
    email: string;
    password: string;
    userAs: "freelancer" | "employee";
}

const registerRequest = async (payload: Register): Promise<AxiosResponse<{ msg: string }>> => {
    const response = postRequest("auth/register", payload);
    return response;
}

export default registerRequest;