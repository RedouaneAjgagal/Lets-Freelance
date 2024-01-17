import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

type SetAsPaidConnectsContainerProps = {
    isError: boolean;
    msg: string;
}

const SetAsPaidConnectsContainer = (props: React.PropsWithoutRef<SetAsPaidConnectsContainerProps>) => {
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
        navigate("..", { relative: "path" });
    }

    return (
        <div className={`${result.style} p-4 flex flex-col gap-2`}>
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

export default SetAsPaidConnectsContainer