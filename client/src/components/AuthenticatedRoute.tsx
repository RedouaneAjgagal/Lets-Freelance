import { useAppSelector } from "../hooks/redux"
import { Navigate } from "react-router-dom";

type AuthenticatedRouteProps = {
    element: JSX.ElementType;
    accessBy?: "freelancer" | "employer";
}

const AuthenticatedRoute = (props: React.PropsWithoutRef<AuthenticatedRouteProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        userInfo ?
            (
                props.accessBy ?
                    (
                        props.accessBy === userInfo.userAs ?
                            <props.element />
                            :
                            <Navigate to="/" />
                    )
                    :
                    <props.element />
            )
            :
            <Navigate to="/auth/login" />
    )
}

export default AuthenticatedRoute