import { Outlet } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";

import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/swiper-bundle.esm.js"

const Root = () => {
    return (
        <div>
            <header>
                <Navbar />
            </header>
            <Outlet />
            <Footer />
        </div>
    )
}

export default Root