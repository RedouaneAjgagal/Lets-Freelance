import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

const logoutRequest = async (): Promise<AxiosResponse<{ msg: string }>> => {
    const response = getRequest("auth/logout");
    return response
}

export default logoutRequest;