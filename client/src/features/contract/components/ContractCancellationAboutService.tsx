import { IncludedInSelectedPackage } from "../../service"
import { ContractCancellationServiceType } from "../services/getContractCancellations"

type ContractCancellationAboutServiceProps = {
    serviceContract: ContractCancellationServiceType
}

const ContractCancellationAboutService = (props: React.PropsWithoutRef<ContractCancellationAboutServiceProps>) => {

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h5 className="font-medium">Service ID:</h5>
                <span className="text-slate-600">{props.serviceContract.serviceInfo}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Title:</h5>
                <span className="text-slate-600">{props.serviceContract.title}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Description:</h5>
                <div className="p-3 bg-slate-200/50 rounded">
                    <span className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: props.serviceContract.description }}></span>
                </div>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Price:</h5>
                <span className="text-slate-600">${props.serviceContract.tier.price.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium capitalize">{props.serviceContract.tierName} tier:</h5>
                <div className="flex flex-col gap-1 border px-4 py-3 rounded">
                    <IncludedInSelectedPackage deliveryTime={props.serviceContract.tier.deliveryTime} includedIn={props.serviceContract.tier.includedIn} />
                </div>
            </div>
        </div>
    )
}

export default ContractCancellationAboutService