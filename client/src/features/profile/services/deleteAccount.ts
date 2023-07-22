import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api"

const deleteAccount = async (): Promise<AxiosResponse<{ msg: string }>> => {
    const response = await deleteRequest("profile");
    return response;
}

export default deleteAccount;