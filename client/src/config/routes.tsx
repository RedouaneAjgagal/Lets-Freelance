import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import { Settings, ResetEmail, SingleProfile } from "../pages/profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "auth/register",
                element: <Register />
            },
            {
                path: "auth/login",
                element: <Login />
            },
            {
                path: "auth/forget-password",
                element: <ForgetPassword />
            },
            {
                path: "auth/reset-password",
                element: <ResetPassword />
            },
            {
                path: "auth/verify-email",
                element: <VerifyEmail />
            },
            {
                path: "profile/settings",
                element: <Settings />
            },
            {
                path: "profile/settings/reset-email",
                element: <ResetEmail />
            },
            {
                path: "profiles/:profileId",
                element: <SingleProfile />
            }
        ]
    }
]);

export default router;