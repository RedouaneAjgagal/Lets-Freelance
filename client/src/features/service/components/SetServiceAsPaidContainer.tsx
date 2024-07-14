import React from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

type SetServiceAsPaidContainerProps = {
    isError: boolean;
    msg: string;
}

const SetServiceAsPaidContainer = (props: React.PropsWithoutRef<SetServiceAsPaidContainerProps>) => {
    const navigate = useNavigate();

    const results = {
        "error": {
            value: props.msg,
            style: "bg-red-200/60 text-red-600"
        },
        "success": {
            value: props.msg,
            style: "bg-green-200/60 text-green-600"
        }
    } as const

    const result = results[props.isError ? "error" : "success"];

    const backNavigator = () => {
        navigate("/profile/employer/bought-services");
    }

    return (
        <div className={`${result.style} p-4 flex flex-col gap-2 rounded lg:w-96`}>
            <h2>{result.value}</h2>
            <div>
                <button onClick={backNavigator} className="text-slate-700 flex items-center gap-1 border-b-2 border-slate-500">
                    <BiArrowBack />
                    Back
                </button>
            </div>
        </div>
    )
}

export default SetServiceAsPaidContainer