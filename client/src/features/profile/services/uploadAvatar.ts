import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

const uploadAvatar = async (avatar: File): Promise<AxiosResponse<{ avatarURL: string }>> => {
    const formData = new FormData();

    formData.append("avatar", avatar);

    const response = await postRequest("profile", formData, true);
    return response;
}

export default uploadAvatar;