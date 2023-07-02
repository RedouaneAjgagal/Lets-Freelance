import { Outlet } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";
import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/swiper-bundle.esm.js"

const Root = () => {

    return (
        <div>
            <Toaster />
            <header>
                <Navbar />
            </header>
            <Outlet />
            <Footer />
            <ScrollToTop />
        </div>
    )
}

export default Root