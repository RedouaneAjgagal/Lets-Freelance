import { Outlet } from "react-router-dom";
import Navbar from "../layouts/navbar";

const Root = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Root