import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";

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
            }
        ]
    }
]);

export default router;