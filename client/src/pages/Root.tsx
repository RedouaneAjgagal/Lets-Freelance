import { Outlet } from "react-router-dom";
import Navbar from "../layouts/navbar";

import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/swiper-bundle.esm.js"

const Root = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Root