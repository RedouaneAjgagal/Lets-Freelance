import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import { Settings, ResetEmail, SingleProfile, Dashboard, Statements, AllFreelancers } from "../pages/profile";
import { AllServices, CreateService, EmployerBoughtServices, FreelancerServices, SetAsPaidService, SingleService, UpdateService } from "../pages/service";
import { EmployerJobProposals, FreelancerProposals, SetPaidFixedPriceProposal, SubmitProposal } from "../pages/proposal";
import { Favorites } from "../pages/favorites";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import Connects from "../pages/profile/Connects";
import SetAsPaidConnects from "../pages/profile/SetAsPaidConnects";
import { AllJobs, CreateJob, EmployerJobs, SingleJob, UpdateJob } from "../pages/job";
import { CancelContract, ContractCancellations, PayWorkedHours, RefundRequest, RefundRequests, SingleContract, SubmitWorkedHours, UserContracts } from "../pages/contract";
import { AdvertisementHomePage, Campaigns, CreateCampaign, CreatePaymentMethod, PaymentMethods, SingleCampaign } from "../pages/advertisement";
import AuthorizedRoute from "../components/AuthorizedRoute";
import { EventReports } from "../pages/report";
import { Messages } from "../pages/message";
import ErrorPage from "../components/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
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
                path: "profiles",
                element: <AllFreelancers />
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
                path: "/profile/employer/jobs/create",
                element: <AuthenticatedRoute element={CreateJob} accessBy="employer" />
            },
            {
                path: "/profile/employer/jobs/:jobId/edit",
                element: <AuthenticatedRoute element={UpdateJob} accessBy="employer" />
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
            },
            {
                path: "/jobs/:jobId",
                element: <SingleJob />
            },
            {
                path: "/proposals/job/:jobId/submit",
                element: <AuthenticatedRoute element={SubmitProposal} accessBy="freelancer" />
            },
            {
                path: "/profile/employer/proposals/job/:jobId",
                element: <AuthenticatedRoute element={EmployerJobProposals} accessBy="employer" />
            },
            {
                path: "/profile/employer/proposals/:proposalId/pay/fixed-price",
                element: <AuthenticatedRoute element={SetPaidFixedPriceProposal} accessBy="employer" />
            },
            {
                path: "/profile/contracts",
                element: <AuthenticatedRoute element={UserContracts} />
            },
            {
                path: "/profile/contracts/:contractId",
                element: <AuthenticatedRoute element={SingleContract} />
            },
            {
                path: "/profile/contracts/:contractId/submit-worked-hours",
                element: <AuthenticatedRoute element={SubmitWorkedHours} accessBy="freelancer" />
            },
            {
                path: "/profile/contracts/:contractId/cancel-contract",
                element: <AuthenticatedRoute element={CancelContract} />
            },
            {
                path: "/profile/contracts/:contractId/worked-hours/pay",
                element: <AuthenticatedRoute element={PayWorkedHours} accessBy="employer" />
            },
            {
                path: "/profile/contracts/:contractId/refund-request/payments/:paymentId",
                element: <AuthenticatedRoute element={RefundRequest} accessBy="employer" />
            },
            {
                path: "/profile/freelancer/advertisements",
                element: <AuthenticatedRoute element={AdvertisementHomePage} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/advertisements/payment-methods",
                element: <AuthenticatedRoute element={PaymentMethods} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/advertisements/payment-methods/create",
                element: <AuthenticatedRoute element={CreatePaymentMethod} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/advertisements/campaigns",
                element: <AuthenticatedRoute element={Campaigns} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/advertisements/campaigns/:campaignId",
                element: <AuthenticatedRoute element={SingleCampaign} accessBy="freelancer" />
            },
            {
                path: "/profile/freelancer/advertisements/create/campaign",
                element: <AuthenticatedRoute element={CreateCampaign} accessBy="freelancer" />
            },
            {
                path: "/profile/auth/contracts/cancelation",
                element: <AuthorizedRoute element={ContractCancellations} accessBy={["admin", "owner"]} />
            },
            {
                path: "/profile/auth/contracts/payments/refund",
                element: <AuthorizedRoute element={RefundRequests} accessBy={["admin", "owner"]} />
            },
            {
                path: "/profile/auth/reports",
                element: <AuthorizedRoute element={EventReports} accessBy={["admin", "owner"]} />
            },
            {
                path: "/profile/messages",
                element: <AuthenticatedRoute element={Messages} />
            }
        ]
    }
]);

export default router;