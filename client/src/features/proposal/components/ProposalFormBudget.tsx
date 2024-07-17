import { SingleJobType } from "../../job";

type ProposalFormBudgetProps = {
    priceType: SingleJobType["priceType"];
    price: SingleJobType["price"];
    errorMsg: string
}

const ProposalFormBudget = (props: React.PropsWithoutRef<ProposalFormBudgetProps>) => {

    const suggestByJobPostPrice = props.priceType === "hourly" ?
        `From $${props.price.min} to $${props.price.max} is the suggested hourly budget by the job post`
        : `$${props.price.max} is the suggested fixed price budget by the job post`;

    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="submitProposal_price">{
                `Budget (${props.priceType})`
            }</label>
            <div className="p-3 rounded bg-slate-100 grid grid-cols-6 items-center gap-3 text-slate-600 xl:bg-white xl:p-0">
                <span className="text-[.95rem] col-span-4">{suggestByJobPostPrice}</span>
                <div className="relative col-span-2">
                    <input placeholder="Price" type="number" name="submitProposal_price" id="submitProposal_price" className={`${props.errorMsg === "" ? "border-slate-300" : "border-red-300"} border-2 px-2 py-1 rounded flex items-center gap-1 justify-between w-full outline-slate-400 pl-7`} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold pointer-events-none">$</span>
                </div>
            </div>
        </div>
    )
}

export default ProposalFormBudget