import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

type VerifyEmail = {
    token: string;
    email: string;
}

const verifyEmailRequest = async (payload: VerifyEmail): Promise<AxiosResponse<{ msg: string }>> => {
    const verifyEmailQueries = `token=${payload.token}&email=${payload.email}`;
    const verifyEmail = await getRequest(`auth/verify-email?${verifyEmailQueries}`);
    return verifyEmail;
}

export default verifyEmailRequest;