import { ServiceIncludedInTier, ServiceTier } from "../services/getSingleService"
import { TbClock } from "react-icons/tb";
import IncludedInSelectedPackage from "./IncludedInSelectedPackage";

type SelectedPackageProps = {
    deliveryTime: ServiceTier["deliveryTime"];
    includedIn: ServiceIncludedInTier[];
}

const SelectedPackage = (props: React.PropsWithoutRef<SelectedPackageProps>) => {

    const expectedDay = `${props.deliveryTime} Day${props.deliveryTime === 1 ? "" : "s"}`;

    const deliveryAt = new Date(new Date().setHours(props.deliveryTime * 24)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });


    return (
        <div className="flex flex-col gap-2">
            <IncludedInSelectedPackage includedIn={props.includedIn} deliveryTime={props.deliveryTime} />
            <div className="flex gap-1 items-start mt-4">
                <div className="pt-1 sm:text-lg"><TbClock /></div>
                <div className="flex flex-col">
                    <p className="text-[.95rem] sm:text-base"><span className="font-medium">{expectedDay}</span> delivery — {deliveryAt}</p>
                    <p className="text-sm text-slate-500 sm:text-[.95rem]">Revisions may occur after this date.</p>
                </div>
            </div>
        </div>
    )
}

export default SelectedPackage