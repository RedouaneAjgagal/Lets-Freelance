import Navbar from "../layouts/navbar"
import Footer from "../layouts/footer"
import error_notFound from "/error_404.png";
import error from "/error.png";
import { useRouteError, } from "react-router-dom"
import { AxiosError } from "axios"
import { useAppSelector } from "../hooks/redux";


type ErrorResponse = {
    data: string;
    internal: boolean;
    status: number;
    statusText: string;
}

const ErrorPage = () => {
    const routeError = useRouteError() as AxiosError<{ msg: string }> | ErrorResponse;

    const isServerError = routeError instanceof AxiosError;

    let errorMsg = "Something went wrong!";

    if (isServerError) {
        errorMsg = `${routeError.response?.data.msg}.` || "Something went wrong!";
    }

    if (!isServerError && routeError.status === 404) {
        errorMsg = "The page you are looking for may have been moved, deleted, or possibly never existed.";
    }


    return (
        <div className="bg-purple-100/30">
            {/* <div className="border-b bg-white">
                <header className="max-w-[100rem] m-auto">
                    <Navbar />
                </header>
            </div> */}
            <div className="max-w-[100rem] m-auto">
                <main className="min-h-screen p-4 flex justify-center text-center">
                    <div className="flex flex-col items-center justify-evenly">
                        <h1 className="font-semibold text-5xl text-slate-900">Uh-Oh...</h1>
                        <p className="text-xl text-slate-600 max-w-[40rem]">{errorMsg}</p>
                        <img src={isServerError ? error : error_notFound} alt="search image" />
                    </div>
                </main>
            </div>
            {/* <div className="max-w-[100rem] m-auto xl:pb-4">
                <Footer />
            </div> */}
        </div>
    )
}

export default ErrorPage