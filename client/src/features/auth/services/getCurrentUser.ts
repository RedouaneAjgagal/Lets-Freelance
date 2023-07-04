import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type User = {
    userId: string;
    userName: string;
}

const getCurrentUserRequest = async (): Promise<AxiosResponse<User>> => {
    const response = await getRequest("auth/current-user");
    return response
}

export default getCurrentUserRequest;