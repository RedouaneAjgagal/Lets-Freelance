import { useState } from "react"
import JobFormPriceType from "./JobFormPriceType"
import JobFormPrice from "./JobFormPrice";

type JobFormStepThreeProps = {
    errors: {
        priceType: boolean;
        price: boolean;
    }
}

const JobFormStepThree = (props: React.PropsWithoutRef<JobFormStepThreeProps>) => {
    const [priceType, setPriceType] = useState<"hourly" | "fixed">("hourly");

    const onSetPriceType = (priceType: "hourly" | "fixed") => {
        setPriceType(priceType);
    }

    return (
        <section className="flex flex-col gap-2">
            <JobFormPriceType setPriceType={onSetPriceType} priceType={priceType} isError={props.errors.priceType} />
            <JobFormPrice priceType={priceType} isError={props.errors.price} />
        </section>
    )
}

export default JobFormStepThree