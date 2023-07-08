import { NextFunction, Response } from "express";
import { CustomAuthRequest } from "./authentication";
import User from "../features/auth/auth.model";
import { UnauthenticatedError, UnauthorizedError } from "../errors";

const auhtorizationByOrder: ["user", "admin", "owner"] = ["user", "admin", "owner"];

const authorization = (authorizedRole: "user" | "admin" | "owner") => {
    return async (req: CustomAuthRequest, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user!.userId);
        if (!user) {
            throw new UnauthenticatedError("Cannot find any user");
        }

        const getRoleIndex = auhtorizationByOrder.findIndex(role => role === authorizedRole);
        const allowedRoles = auhtorizationByOrder.slice(getRoleIndex);

        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("You dont have access to these ressources");
        }

        if (!user.isVerified) {
            throw new UnauthorizedError("Account must be verified");
        }
        next();
    }
}

export default authorization;