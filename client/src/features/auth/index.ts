import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import registerReducer from "./redux/register";
import loginReducer from "./redux/login";
import forgetPasswordReducer from "./redux/forgetPassword";
import resetPasswordReducer from "./redux/resetPassword";
import useVerifyEmailQuery from "./hooks/useVerifyEmailQuery";


export {
    RegisterForm,
    LoginForm,
    registerReducer,
    loginReducer,
    forgetPasswordReducer,
    resetPasswordReducer,
    useVerifyEmailQuery
}