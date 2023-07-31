import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import useVerifyEmailQuery from "./hooks/useVerifyEmailQuery";
import authReducer from "./redux/auth";
import useLogoutMutation from "./hooks/useLogoutMutation";
// import useCurrentUserMutation from "./hooks/useCurrentUserMutation";
import useCurrentUserQuery from "./hooks/useCurrentUserQuery";


export {
    RegisterForm,
    LoginForm,
    useVerifyEmailQuery,
    authReducer,
    useLogoutMutation,
    useCurrentUserQuery
}