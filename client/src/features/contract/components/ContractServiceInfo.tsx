import { useState } from "react";
import { ServiceContractType } from "../services/getUserSingleContract"
import DescriptionModal from "../modals/DescriptionModal";
import useOverflow from "../../../hooks/useOverflow";
import { IncludedInSelectedPackage } from "../../service";
import toUpperCase from "../../../utils/toUpperCase";
import { Link } from "react-router-dom";

type ContractServiceInfoProps = {
    service: ServiceContractType["service"];
}

const ContractServiceInfo = (props: React.PropsWithoutRef<ContractServiceInfoProps>) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

    useOverflow(isDescriptionOpen);

    return (
        <div className="flex flex-col gap-2">
            <div>
                <Link to={`/services/${props.service.serviceInfo}`} className="underline text-sm text-slate-600">Service</Link>
                <h3 className="text-lg font-medium leading-5">Contract title: <span className="text-base text-slate-700">"{props.service.title}"</span>
                </h3>
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">Description:</h3>
                <button onClick={() => setIsDescriptionOpen(true)} className="underline">View</button>
                {isDescriptionOpen ?
                    <DescriptionModal onClose={() => setIsDescriptionOpen(false)} description={props.service.description} />
                    : null
                }
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">{toUpperCase({ value: props.service.tierName })} tier: </h3>
                <em>${props.service.tier.price.toFixed(2)} </em>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium leading-5">Included In:</h3>
                <div className="flex flex-col gap-1">
                    <IncludedInSelectedPackage deliveryTime={props.service.tier.deliveryTime} includedIn={props.service.tier.includedIn} />
                </div>
            </div>
        </div>
    )
}

export default ContractServiceInfo