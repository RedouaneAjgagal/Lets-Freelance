import { useState } from "react"
import JobFormPriceType from "./JobFormPriceType"
import JobFormPrice from "./JobFormPrice";


const JobFormStepThree = () => {
    const [priceType, setPriceType] = useState<"hourly" | "fixed">("hourly");

    const onSetPriceType = (priceType: "hourly" | "fixed") => {
        setPriceType(priceType);
    }

    return (
        <section className="flex flex-col gap-2">
            <JobFormPriceType setPriceType={onSetPriceType} priceType={priceType} />
            <JobFormPrice priceType={priceType} />
        </section>
    )
}

export default JobFormStepThree