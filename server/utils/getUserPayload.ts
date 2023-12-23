import jwt from "jsonwebtoken";
import { User } from "../middlewares/authentication";

const getUserPayload = ({ accessToken }: { accessToken: string }) => {
    try {
        const userPayload = jwt.verify(accessToken, process.env.JWT_SECRET!) as User;
        return userPayload;
    } catch (error) {
        return undefined;
    }
}

export default getUserPayload;