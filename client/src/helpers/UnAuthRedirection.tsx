import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux";

interface Props {
    redirectTo: string
}

const UnAuthRedirection = (props: React.PropsWithoutRef<Props>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    if (!userInfo) {
        return <Navigate to={props.redirectTo} replace />
    }
}

export default UnAuthRedirection;