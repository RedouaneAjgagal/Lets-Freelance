import { ServiceIncludedInTier } from "../services/getSingleService"
import { TbCheck, TbX } from "react-icons/tb";

type IncludedInProps = {
    description: ServiceIncludedInTier["description"];
    result: ServiceIncludedInTier["result"];
}

const IncludedIn = (props: React.PropsWithoutRef<IncludedInProps>) => {

    return (
        <div className="flex items-end justify-between gap-2 text-[.95rem]">
            <span className="">{props.description}</span>
            <span className="font-medium">
                {typeof props.result === "boolean" ?
                    (props.result ? <TbCheck className="text-xl text-green-600" /> : <TbX className="text-xl text-red-600" />)
                    :
                    `${props.result}`
                }
            </span>
        </div>
    )
}

export default IncludedIn