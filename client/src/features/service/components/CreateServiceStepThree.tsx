import CreateServiceWrapper from "./CreateServiceWrapper"
import { useAppSelector } from "../../../hooks/redux"
import TierContainer from "./TierContainer";
import { ServiceTiersTypes } from "../redux/createService";
import { useState } from "react";

const CreateServiceStepThree = () => {
  const { tier } = useAppSelector(state => state.createServiceReducer);

  const [isTierOpen, setIsTierOpen] = useState({
    starter: true,
    standard: false,
    advanced: false
  });

  const openTierHandler = (tierName: keyof ServiceTiersTypes) => {
    setIsTierOpen(prev => {
      return {
        ...prev,
        [tierName]: !prev[tierName]
      }
    });
  }


  const tiers = Object.entries(tier).map(([key, tier]) => {
    const tierName = key as keyof ServiceTiersTypes;

    let hasErrorMsg = false;

    const generatTierRequired = ["deliveryTime", "price"] as const;
    for (const key of generatTierRequired) {
      const tierInput = tier[key];
      if (tierInput.error.isError && tierInput.error.msg) {
        hasErrorMsg = true;
      }
    }

    if (!hasErrorMsg) {
      tier.includedIn.value.forEach(includedIn => {
        const includedInRequired = ["description", "result"] as const;
        for (const key of includedInRequired) {
          const tierInput = includedIn[key];
          if (tierInput.error.isError) {
            hasErrorMsg = true;
          }
        }
      })
    }

    return (
      <TierContainer key={key} tierName={tierName} deliveryTime={tier.deliveryTime} price={tier.price} includedIn={tier.includedIn.value} onToggle={openTierHandler} isTierOpen={isTierOpen[tierName]} isError={hasErrorMsg} />
    )
  });

  return (
    <CreateServiceWrapper title="Tiers">
      <div className="flex flex-col gap-4">
        {tiers}
      </div>
    </CreateServiceWrapper>
  )
}

export default CreateServiceStepThree