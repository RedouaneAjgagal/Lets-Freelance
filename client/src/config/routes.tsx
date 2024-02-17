import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import { Settings, ResetEmail, SingleProfile, Dashboard, Statements } from "../pages/profile";
import { AllServices, CreateService, EmployerBoughtServices, FreelancerServices, SetAsPaidService, SingleService, UpdateService } from "../pages/service";
import { FreelancerProposals } from "../pages/proposal";
import { Favorites } from "../pages/favorites";

import AuthenticatedRoute from "../components/AuthenticatedRoute";
import Connects from "../pages/profile/Connects";
import SetAsPaidConnects from "../pages/profile/SetAsPaidConnects";
import { AllJobs, EmployerJobs } from "../pages/job";

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
                element: <AuthenticatedRoute element={Settings} />
            },
            {
                path: "profile/settings/reset-email",
                element: <AuthenticatedRoute element={ResetEmail} />
            },
            {
                path: "profiles/:profileId",
                element: <SingleProfile />
            },
            {
                path: "profile/dashboard",
                element: <AuthenticatedRoute element={Dashboard} />
            },
            {
                path: "profile/statements",
                element: <AuthenticatedRoute element={Statements} />
            },
            {
                path: "profile/favorites",
                element: <AuthenticatedRoute element={Favorites} />
            },
            {
                path: "profile/freelancer/services",
                element: <AuthenticatedRoute element={FreelancerServices} accessBy="freelancer" />
            },
            {
                path: "profile/freelancer/proposals",
                element: <AuthenticatedRoute element={FreelancerProposals} accessBy="freelancer" />
            },
            {
                path: "profile/freelancer/connects",
                element: <AuthenticatedRoute element={Connects} accessBy="freelancer" />
            },
            {
                path: "profile/freelancer/connects/buy",
                element: <AuthenticatedRoute element={SetAsPaidConnects} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/service/create",
                element: <AuthenticatedRoute element={CreateService} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/services/:serviceId/edit",
                element: <AuthenticatedRoute element={UpdateService} accessBy="freelancer" />
            },
            {
                path: "/profile/employer/jobs",
                element: <AuthenticatedRoute element={EmployerJobs} accessBy="employer" />
            },
            {
                path: "/profile/employer/bought-services",
                element: <AuthenticatedRoute element={EmployerBoughtServices} accessBy="employer" />
            },
            {
                path: "/services",
                element: <AllServices />
            },
            {
                path: "/services/:serviceId",
                element: <SingleService />
            },
            {
                path: "/services/:serviceId/order",
                element: <AuthenticatedRoute element={SetAsPaidService} accessBy="employer" />
            },
            {
                path: "/jobs",
                element: <AllJobs />
            }
        ]
    }
]);

export default router;