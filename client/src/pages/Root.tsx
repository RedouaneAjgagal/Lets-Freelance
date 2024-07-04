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

const Root = () => {
    useAuthChecker();

    const { pathname } = useLocation();

    return (
        <div className={pathname.startsWith("/profile/")
            ? "bg-purple-100/30"
            : "bg-white"
        }>
            <Toaster />
            <div className="border-b bg-white">
                <header className="max-w-[80rem] m-auto">
                    <Navbar />
                </header>
            </div>
            <div className="max-w-[80rem] m-auto">
                <Outlet />
                <Footer />
            </div>
            <ScrollToTop />
        </div>
    )
}

export default Root