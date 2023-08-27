import { RequestHandler } from "express";
import { IProfile } from "../features/profile/profile.model";
import { UnauthorizedError } from "../errors";

type UserAsOnly = {
    currentUserRole: IProfile["userAs"];
    permissionedRole: IProfile["userAs"];
}

const userAsPermission = ({ currentUserRole, permissionedRole }: UserAsOnly) => {
    if (currentUserRole !== permissionedRole) {
        throw new UnauthorizedError(`Unauthorized role`);
    }
}

export default userAsPermission;