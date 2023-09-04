type PermissionChecker = {
    allowedRoles: string[];
    currentRole: "user" | "admin" | "owner";
}

const rolePermissionChecker = ({ allowedRoles, currentRole }: PermissionChecker) => {
    if (allowedRoles.includes(currentRole)) {
        return true;
    }
    return false;
}

export default rolePermissionChecker