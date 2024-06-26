import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type User = {
    userId: string;
    profileId: string;
    userName: string;
    avatar: string;
    expirationDate: number;
    userAs: "freelancer" | "employer";
    role: "user" | "admin" | "owner";
}

const getCurrentUserRequest = async (): Promise<AxiosResponse<User>> => {
    const response = await getRequest("auth/current-user");
    return response
}

export default getCurrentUserRequest;