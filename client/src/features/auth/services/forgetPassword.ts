import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

type ForgetPassword = {
    email: string
}

const forgetPasswordRequest = async (payload: ForgetPassword): Promise<AxiosResponse<{ msg: string }>> => {
    const response = await postRequest("auth/forget-password", payload);
    return response;
}

export default forgetPasswordRequest;