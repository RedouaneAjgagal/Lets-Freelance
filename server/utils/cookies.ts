import { Response } from "express";
import createToken from "./createToken"

type Payload = {
    userId: string;
    userName: string;
}

const attachCookieToResponse = (userInfo: Payload, res: Response) => {
    const expiresIn = 2 * 60 * 60 * 1000; // 2h
    // create jwt token
    const token = createToken({
        payload: userInfo,
        expiresIn
    });

    // attach token to response
    res.cookie("accessToken", token, {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
}

export {
    attachCookieToResponse
}