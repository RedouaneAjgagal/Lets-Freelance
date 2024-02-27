type JobFormPriceProps = {
    priceType: "hourly" | "fixed";
};

const JobFormPrice = (props: React.PropsWithoutRef<JobFormPriceProps>) => {

    const priceTypes: ["min", "max"] | ["budget"] = props.priceType === "hourly" ? ["min", "max"] : ["budget"];

    const priceInputs = priceTypes.map(price => {
        const priceContentOptions = {
            min: "From",
            max: "To",
            budget: "Budget"
        }

        const priceContent = priceContentOptions[price];

        return (
            <div key={price} className={`${props.priceType === "fixed" ? "w-full" : ""} flex flex-col gap-1`}>
                <label htmlFor={`job_price_${price}`} className="text-lg font-medium">{priceContent}</label>
                <div className="relative">
                    <div className="flex items-center gap-1">
                        <input id={`job_price_${price}`} name={`job_price_${price}`} type="number" className={`${props.priceType === "hourly" ? "max-w-[7rem]" : "max-w-full"} border-2 px-2 py-1 rounded flex items-center gap-1 justify-between w-full border-slate-300 outline-slate-400 pl-7`} min={1} />
                        {props.priceType === "hourly" ?
                            <span className="text-sm">/hour</span>
                            : null
                        }
                    </div>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold pointer-events-none">$</span>
                </div>
            </div>
        )
    })

    return (
        <div className="flex items-start gap-5 py-4">
            {priceInputs}
        </div>
    )
}

export default JobFormPrice