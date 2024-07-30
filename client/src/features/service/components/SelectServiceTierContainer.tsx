import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierInput from "./SelectServiceTierInput";
import SelectedPackage from "./SelectedPackage";
import CtaOrderService from "./CtaOrderService";

type SelectServiceTierContainerProps = {
    userId: SingleServiceType["user"];
    serviceId: SingleServiceType["_id"];
    profileName: string;
    tier: SingleServiceType["tier"];
    isPreview?: boolean;
    isDesktopSize?: boolean;
    onChangeTier: (tier: "starter" | "standard" | "advanced") => void;
    selectedTier: "starter" | "standard" | "advanced";
    hideCta?: boolean;
}

const SelectServiceTierContainer = (props: React.PropsWithoutRef<SelectServiceTierContainerProps>) => {
    const tiers = ["starter", "standard", "advanced"] as const;

    const selectedPackage = props.tier[props.selectedTier];

    return (
        <div key={1} className={`p-4 w-full rounded border sm:p-6 lg:px-4 xl:p-6 ${props.isPreview ? "flex flex-col gap-4" : `${props.isDesktopSize ? "hidden lg:flex lg:flex-col lg:gap-4 lg:self-start lg:sticky lg:top-4 xl:rounded-lg" : "flex flex-col gap-4 lg:hidden"}`}`}>
            <fieldset>
                <legend className="text-lg font-medium pb-4 sm:text-xl">Select service tier</legend>
                <div className="flex items-start justify-between">
                    {tiers.map(tier => <SelectServiceTierInput key={tier} tier={tier} price={props.tier[tier].price} selectedTier={props.selectedTier} setTier={() => props.onChangeTier(tier)} />)}
                </div>
            </fieldset>
            <hr />
            <SelectedPackage deliveryTime={selectedPackage.deliveryTime} includedIn={selectedPackage.includedIn} />
            {
                props.isPreview || props.hideCta
                    ? null
                    : <CtaOrderService userId={props.userId} selectedTier={props.selectedTier} serviceId={props.serviceId} selectedPackagePrice={selectedPackage.price} isDesktopSize={props.isDesktopSize} />
            }
        </div>
    )
}

export default SelectServiceTierContainer