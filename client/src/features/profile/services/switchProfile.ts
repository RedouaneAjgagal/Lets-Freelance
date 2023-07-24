import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

const swtichProfile = async (switchToRole: "freelancer" | "employer"): Promise<AxiosResponse<{ msg: string }>> => {
    const response = await patchRequest("profile", {
        switchRole: {
            userAs: switchToRole
        }
    });
    return response;
}

export default swtichProfile;