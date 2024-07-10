import { TbClock, TbTicket } from "react-icons/tb";

type JobFormPriceTypeProps = {
    setPriceType: (priceType: "hourly" | "fixed") => void;
    priceType: "hourly" | "fixed";
    isError: boolean;
}

const JobFormPriceType = (props: React.PropsWithoutRef<JobFormPriceTypeProps>) => {

    const priceTypes = [
        {
            value: "hourly",
            icon: TbClock
        },
        {
            value: "fixed",
            icon: TbTicket
        },
    ] as const;

    const pricetypeInputs = priceTypes.map(priceType => {

        const labelContentOptions = {
            hourly: "Hourly rate",
            fixed: "Project budget"
        } as const;

        const labelContent = labelContentOptions[priceType.value];

        const setPriceTypeHandler = () => {
            props.setPriceType(priceType.value);
        }

        const isChecked = priceType.value === props.priceType;

        return (
            <label key={priceType.value} className={`${isChecked ? "bg-purple-100/60 border-purple-500" : "bg-transparent"} relative border-2 rounded p-4 min-w-[11rem] cursor-pointer md:min-w-[16rem]`} htmlFor={`job_priceType_${priceType.value}`}>
                <div className="flex flex-col gap-2">
                    <priceType.icon size={20} />
                    <div className="absolute top-2 right-2 h-5 w-5">
                        <div className={`${isChecked ? "border-purple-500 bg-purple-500" : "border-slate-300 bg-transparent"} relative border-2  w-full h-full rounded-full`}>
                            <span className={`${isChecked ? "border-white" : "border-transparent"} absolute border w-3 h-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}></span>
                        </div>
                    </div>
                    <span className="font-medium text-lg">{labelContent}</span>
                </div>
                <input onChange={setPriceTypeHandler} type="radio" name="job_priceType" id={`job_priceType_${priceType.value}`} className="sr-only" value={props.priceType} defaultChecked={isChecked} hidden />
            </label>
        )
    })

    return (
        <div className="flex gap-4 flex-wrap md:gap-6">
            {pricetypeInputs}
        </div>
    )
}

export default JobFormPriceType