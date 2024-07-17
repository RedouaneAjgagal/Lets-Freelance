import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";
import useAuthChecker from "../hooks/useAuthChecker";
import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/swiper-bundle.esm.js"
import UserMenuSidebar from "../components/UserMenuSidebar";

const Root = () => {
    useAuthChecker();

    const { pathname } = useLocation();

    const isProfileRoute = pathname.startsWith("/profile/")

    return (
        <div className={(isProfileRoute && !pathname.startsWith("/profile/freelancer/advertisements/")) || (pathname.startsWith("/auth/") && !pathname.startsWith("/profile/freelancer/advertisements/"))
            ? "bg-purple-100/30"
            : pathname.startsWith("/profile/freelancer/advertisements/")
                ? "bg-slate-200/70"
                : "bg-white"
        }>
            <Toaster />
            <div className="border-b bg-white">
                <header className="max-w-[100rem] m-auto">
                    <Navbar />
                </header>
            </div>
            <div className="max-w-[100rem] m-auto xl:pb-4">
                <div className={isProfileRoute ? "lg:grid lg:grid-cols-12 lg:items-start" : ""}>
                    {isProfileRoute
                        ? <UserMenuSidebar />
                        : null
                    }
                    <div className="lg:md:col-span-9 xl:md:col-span-9">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
            <ScrollToTop />
        </div>
    )
}

export default Root