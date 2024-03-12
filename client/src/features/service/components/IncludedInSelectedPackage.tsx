import { ServiceIncludedInTier, ServiceTier } from "../services/getSingleService"
import IncludedIn from "./IncludedIn";

type IncludedInSelectedPackageProps = {
    includedIn: ServiceIncludedInTier[];
    deliveryTime: ServiceTier["deliveryTime"];
}

const IncludedInSelectedPackage = (props: React.PropsWithoutRef<IncludedInSelectedPackageProps>) => {

    const deliveryTime: ServiceIncludedInTier = {
        _id: crypto.randomUUID(),
        description: "Delivery time",
        result: `${props.deliveryTime} Day${props.deliveryTime === 1 ? "" : "s"}`
    }

    const includedIn = [deliveryTime, ...props.includedIn];

    return (
        includedIn.map(included => <IncludedIn key={crypto.randomUUID()} description={included.description} result={included.result} />)
    )
}

export default IncludedInSelectedPackage