import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type ResetPassword = {
    token: string;
    email: string;
    newPassword: string;
    repeatNewPassword: string;
}

const resetPasswordRequest = async (payload: ResetPassword): Promise<AxiosResponse<{ msg: string }>> => {
    const credentialQueries = `token=${payload.token}&email=${payload.email}`;
    const response = await patchRequest(`auth/reset-password?${credentialQueries}`, {
        newPassword: payload.newPassword,
        repeatNewPassword: payload.repeatNewPassword
    });
    return response;
}

export default resetPasswordRequest;