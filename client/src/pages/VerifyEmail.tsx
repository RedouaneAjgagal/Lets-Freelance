import { useVerifyEmailQuery } from "../features/auth";

const VerifyEmail = () => {
    useVerifyEmailQuery();
    return (
        <div className="text-center min-h-[60vh] bg-purple-100/30 flex justify-center items-center">
            <h1 className="text-xl">Verifying..</h1>
        </div>
    )
}

export default VerifyEmail