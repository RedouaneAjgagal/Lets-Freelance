import { ServiceIncludedInTier, ServiceTier } from "../services/getSingleService"
import IncludedIn from "./IncludedIn";
import { TbClock } from "react-icons/tb";

type SelectedPackageProps = {
    deliveryTime: ServiceTier["deliveryTime"];
    includedIn: ServiceIncludedInTier[];
}

const SelectedPackage = (props: React.PropsWithoutRef<SelectedPackageProps>) => {
    const deliveryTime: ServiceIncludedInTier = {
        _id: crypto.randomUUID(),
        description: "Delivery time",
        result: `${props.deliveryTime} Day${props.deliveryTime === 1 ? "" : "s"}`
    }

    const includedIn = [deliveryTime, ...props.includedIn];

    const deliveryAt = new Date(new Date().setHours(props.deliveryTime * 24)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    return (
        <div className="flex flex-col gap-2">
            {includedIn.map(included => <IncludedIn key={crypto.randomUUID()} description={included.description} result={included.result} />)}
            <div className="flex gap-1 items-start mt-4">
                <div className="pt-1"><TbClock /></div>
                <div className="flex flex-col">
                    <p className="text-[.95rem]"><span className="font-medium">{deliveryTime.result}</span> delivery — {deliveryAt}</p>
                    <p className="text-sm text-slate-500">Revisions may occur after this date.</p>
                </div>
            </div>
        </div>
    )
}

export default SelectedPackage