import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

type AuthorizedRouteProps = {
    element: JSX.ElementType;
    accessBy: ("admin" | "owner")[];
}

const AuthorizedRoute = (props: React.PropsWithoutRef<AuthorizedRouteProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        userInfo ?
            (
                props.accessBy.includes(userInfo.role) ?
                    <props.element />
                    :
                    <Navigate to="/" />
            )
            :
            <Navigate to="/auth/login" />
    )
}

export default AuthorizedRoute