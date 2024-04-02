import { FaArrowDown } from "react-icons/fa";
import AdSetInputContainer from "./AdSetInputContainer";
import { AdverisementPrimaryButton } from "..";

type CampaignFormProps = {
    type: "create";
}

const CampaignForm = (props: React.PropsWithoutRef<CampaignFormProps>) => {

    const addAdSetHandler = () => {
        console.log("Add another ad");
    }

    const keywords = [{ id: "1", content: "React" }, { id: "2", content: "Redux" }];


    const submitCampaignFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Submit");
    }

    return (
        <form onSubmit={submitCampaignFormHandler} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h2 className="font-medium text-lg underline decoration-double decoration-amber-500">General campaign details</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-[.1rem]">
                        <label htmlFor={`${props.type}_campaignName`} className="text-[.9rem]">Campaign name</label>
                        <input type="text" id={`${props.type}_campaignName`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none" />
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_budgetType`} className="text-[.9rem]">Budget type</label>
                            <select id={`${props.type}_budgetType`} defaultValue="daily" className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group">
                                <option value="daily">Daily</option>
                                <option value="total">Total</option>
                            </select>
                            <span className="absolute right-2 bottom-3 text-slate-700">
                                <FaArrowDown size={12} />
                            </span>
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full">
                            <label htmlFor={`${props.type}_budget`} className="text-[.9rem]">Budget ($)</label>
                            <input type="number" id={`${props.type}_budget`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" />
                        </div>
                    </div>
                    <div className="flex justify-between flex-col gap-4">
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_startDate`} className="text-[.9rem]">Start date</label>
                            <input type="date" id={`${props.type}_startDate`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" />
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_endDate`} className="text-[.9rem]">End date</label>
                            <input type="date" id={`${props.type}_endDate`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-medium text-lg underline decoration-double decoration-amber-500">Ad set details</h2>
                <div className="flex flex-col gap-8">
                    <AdSetInputContainer index={0} keywords={keywords} type="create" />
                    <button onClick={addAdSetHandler} type="button" className="bg-slate-600 text-white font-medium rounded py-1 px-3 self-start">Add another ad</button>
                </div>
            </div>
            <AdverisementPrimaryButton type="submit" fullWidth>
                CREATE CAMPAIGN
            </AdverisementPrimaryButton>
        </form>
    )
}

export default CampaignForm