import { Response } from "express";
import createJwtToken from "./createJwtToken"

const attachCookieToResponse = (payload: {}, res: Response) => {
    const expiresIn = 2 * 60 * 60 * 1000; // 2h
    // create jwt token
    const token = createJwtToken({
        payload,
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

const destroyCookie = (res: Response) => {
    res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })
}

export {
    attachCookieToResponse,
    destroyCookie
}