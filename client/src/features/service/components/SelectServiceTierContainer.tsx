import { useState } from "react";
import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierInput from "./SelectServiceTierInput";
import SelectedPackage from "./SelectedPackage";
import { PrimaryButton } from "../../../layouts/brand";
import formatProfileName from "../../../utils/formatProfileName";

type SelectServiceTierContainerProps = {
    profileId: SingleServiceType["profile"]["_id"];
    serviceId: SingleServiceType["_id"];
    profileName: string;
    tier: SingleServiceType["tier"];
}

const SelectServiceTierContainer = (props: React.PropsWithoutRef<SelectServiceTierContainerProps>) => {

    const [selectedTier, setSelectedTier] = useState<"starter" | "standard" | "advanced">("starter");
    const changeTierHandler = (tier: "starter" | "standard" | "advanced") => {
        setSelectedTier(tier)
    }

    const tiers = ["starter", "standard", "advanced"] as const;

    const selectedPackage = props.tier[selectedTier];

    const orderServiceHandler = () => {
        console.log({ serviceId: props.serviceId, selectedTier });
    }

    const messageFreelancer = () => {
        console.log({ profileId: props.profileId });
    }


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
            <div className="flex gap-3 fixed bottom-0 bg-white w-full left-1/2 -translate-x-1/2 p-4 border-t z-20">
                <div className="w-full order-1">
                    <PrimaryButton disabled={false} fullWith justifyConent="center" style="solid" type="button" x="md" y="lg" onClick={orderServiceHandler}>{`Continue ($${selectedPackage.price.toFixed(0)})`}</PrimaryButton>
                </div>
                <div className="flex">
                    <PrimaryButton disabled={false} fullWith justifyConent="center" style="outline" type="button" x="md" y="sm" onClick={messageFreelancer}>{`Message`}</PrimaryButton>
                </div>
            </div>
        </aside>
    )
}

export default SelectServiceTierContainer