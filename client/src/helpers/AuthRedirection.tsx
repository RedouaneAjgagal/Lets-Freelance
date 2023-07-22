import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux";

const AuthRedirection = () => {
  const { userInfo } = useAppSelector(state => state.authReducer);
  if (userInfo) {
    return <Navigate to={"/profile/settings"} replace />
  }

}

export default AuthRedirection;