import { Response } from "express";
import createJwtToken from "./createJwtToken"

type TttachCookieToResponse = {
    cookieName: string;
    expiresInMs: number;
    payload: {};
    res: Response;
}

const attachCookieToResponse = ({ cookieName, expiresInMs, payload, res }: TttachCookieToResponse) => {
    // create jwt token
    const token = createJwtToken({
        payload,
        expiresIn: expiresInMs / 1000
    });

    // attach token to response
    res.cookie(cookieName, token, {
        expires: new Date(Date.now() + expiresInMs),
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
}

const destroyCookie = ({ cookieName, res }: { cookieName: string; res: Response }) => {
    res.cookie(cookieName, null, {
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