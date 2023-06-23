import { Outlet } from "react-router-dom";
import Navbar from "../layouts/navbar";

const Root = () => {
    return (
        <div className="flex flex-col bg-indigo-100 min-h-screen">
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Root