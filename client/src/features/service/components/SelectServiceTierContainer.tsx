import { useState } from "react";
import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierInput from "./SelectServiceTierInput";
import SelectedPackage from "./SelectedPackage";
import formatProfileName from "../../../utils/formatProfileName";
import CtaOrderService from "./CtaOrderService";

type SelectServiceTierContainerProps = {
    profileId: SingleServiceType["profile"]["_id"];
    serviceId: SingleServiceType["_id"];
    profileName: string;
    tier: SingleServiceType["tier"];
    isPreview?: boolean;
}

const SelectServiceTierContainer = (props: React.PropsWithoutRef<SelectServiceTierContainerProps>) => {

    const [selectedTier, setSelectedTier] = useState<"starter" | "standard" | "advanced">("starter");
    const changeTierHandler = (tier: "starter" | "standard" | "advanced") => {
        setSelectedTier(tier)
    }

    const tiers = ["starter", "standard", "advanced"] as const;

    const selectedPackage = props.tier[selectedTier];

    const [freelancerName] = formatProfileName(props.profileName).split(" ");

    return (
        <aside className="p-4 rounded border flex flex-col gap-4">
            <fieldset className="">
                <legend className="text-lg font-medium pb-4">Select service tier</legend>
                <div className="flex items-start justify-between">
                    {tiers.map(tier => <SelectServiceTierInput key={tier} tier={tier} price={props.tier[tier].price} selectedTier={selectedTier} setTier={changeTierHandler} />)}
                </div>
            </fieldset>
            <hr />
            <SelectedPackage deliveryTime={selectedPackage.deliveryTime} includedIn={selectedPackage.includedIn} />
            {
                !props.isPreview ?
                    <CtaOrderService profileId={props.profileId} selectedTier={selectedTier} serviceId={props.serviceId} selectedPackagePrice={selectedPackage.price} />
                    : null
            }
        </aside>
    )
}

export default SelectServiceTierContainer