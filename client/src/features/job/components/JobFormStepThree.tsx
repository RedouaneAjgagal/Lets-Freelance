import { useState } from "react"
import JobFormPriceType from "./JobFormPriceType"
import JobFormPrice from "./JobFormPrice";
import { useAppSelector } from "../../../hooks/redux";

const JobFormStepThree = () => {
    const jobFormReducer = useAppSelector(state => state.jobFormReducer);

    const [priceType, setPriceType] = useState(jobFormReducer.priceType.value);

    const onSetPriceType = (priceType: "hourly" | "fixed") => {
        setPriceType(priceType);
    }

    return (
        <section className="flex flex-col gap-2">
            <JobFormPriceType setPriceType={onSetPriceType} priceType={priceType} isError={jobFormReducer.priceType.error.message !== ""} />
            <JobFormPrice priceType={priceType} isError={jobFormReducer.price.error.message !== ""} defaultValue={jobFormReducer.price.value} />
        </section>
    )
}

export default JobFormStepThree