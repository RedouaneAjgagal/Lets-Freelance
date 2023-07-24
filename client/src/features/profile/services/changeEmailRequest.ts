import { getRequest } from "../../../services/api"

const changeEmailRequest = async (): Promise<{ msg: string }> => {
    const response = await getRequest("auth/change-email");
    const data = await response.data;
    return data;
}

export default changeEmailRequest;