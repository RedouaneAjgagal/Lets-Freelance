import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors";

export type User = {
    userId: string;
    exp: number;
}

export interface CustomAuthRequest extends Request {
    user?: User
}

const authentication: RequestHandler = async (req: CustomAuthRequest, res, next) => {
    const { accessToken } = req.signedCookies;
    // console.log({accessToken});
    
    if (!accessToken) {
        throw new UnauthenticatedError("Authentication failed");
    }
    try {
        const userPayload = jwt.verify(accessToken, process.env.JWT_SECRET!) as User;
        req.user = userPayload;
        next();
        return;
    } catch (error) {
        throw new UnauthenticatedError("Authentication failed");
    }

}

export default authentication;