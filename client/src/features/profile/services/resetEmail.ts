import { postRequest } from "../../../services/api"

type ResetEmail = {
    token: string;
    newEmail: string;
}

const resetEmail = async ({ token, newEmail }: ResetEmail): Promise<{ msg: string }> => {
    const response = await postRequest(`auth/reset-email?token=${token}`, {
        newEmail
    });
    const data = await response.data;
    return data;
}

export default resetEmail;