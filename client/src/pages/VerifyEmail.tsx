import { TbLoader2 } from "react-icons/tb";
import { useVerifyEmailQuery } from "../features/auth";

const VerifyEmail = () => {
    const verifyEmailQuery = useVerifyEmailQuery();
    return (
        <div className="text-center min-h-[60vh] flex justify-center items-center md:min-h-[40vh]">
            {verifyEmailQuery.isLoading
                ? <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-xl">Verifying...</h1>
                    <TbLoader2 className="animate-spin" size={20} />
                </div>
                : verifyEmailQuery.isSuccess
                    ? <div className="flex flex-col gap-2 items-center justify-center">
                        <h1 className="text-xl text-green-600 font-medium">Success!</h1>
                    </div>
                    : <div className="flex flex-col gap-2 items-center justify-center">
                        <h1 className="text-xl text-red-600 font-medium">Something went wrong!</h1>
                    </div>
            }
        </div>
    )
}

export default VerifyEmail