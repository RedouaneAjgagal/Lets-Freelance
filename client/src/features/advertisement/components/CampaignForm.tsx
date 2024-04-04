import { FaArrowDown } from "react-icons/fa";
import AdSetInputContainer from "./AdSetInputContainer";
import { AdverisementPrimaryButton } from "..";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { campaignFormAction } from "../redux/campaignForm";

type CampaignFormProps = {
    type: "create";
}

const CampaignForm = (props: React.PropsWithoutRef<CampaignFormProps>) => {
    const dispatch = useAppDispatch();
    const campaignValues = useAppSelector(state => state.campaignFormReducer);

    const addAdSetHandler = () => {
        dispatch(campaignFormAction.AddNewAdSet());
    }

    const setCampaignNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        dispatch(campaignFormAction.setCampaignName(name));
    }

    const setBudgetTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const budgetType = e.target.value;
        dispatch(campaignFormAction.setBudgetType(budgetType));
    }

    const setBudgetHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const budget = e.target.value;
        dispatch(campaignFormAction.setBudget(budget));
    }

    const setStartingDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const startingDate = e.target.value;
        dispatch(campaignFormAction.setStartingDate(startingDate));
    }

    const setEndingDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const endingDate = e.target.value;
        dispatch(campaignFormAction.setEndingDate(endingDate));
    }

    const submitCampaignFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submit");
    }


    const todayDate = new Date().toJSON().split("T")[0];
    const nextDayDate = new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)).toJSON().split("T")[0];

    return (
        <form onSubmit={submitCampaignFormHandler} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h2 className="font-medium text-lg underline decoration-double decoration-amber-500">General campaign details</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-[.1rem]">
                        <label htmlFor={`${props.type}_campaignName`} className="text-[.9rem]">Campaign name</label>
                        <input type="text" id={`${props.type}_campaignName`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none" value={campaignValues.name.value} onChange={setCampaignNameHandler} />
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_budgetType`} className="text-[.9rem]">Budget type</label>
                            <select id={`${props.type}_budgetType`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group" value={campaignValues.budgetType.value} onChange={setBudgetTypeHandler}>
                                <option value="daily">Daily</option>
                                <option value="total">Total</option>
                            </select>
                            <span className="absolute right-2 bottom-3 text-slate-700">
                                <FaArrowDown size={12} />
                            </span>
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full">
                            <label htmlFor={`${props.type}_budget`} className="text-[.9rem]">Budget ($)</label>
                            <input type="number" id={`${props.type}_budget`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" value={campaignValues.budget.value === 0 ? "" : campaignValues.budget.value} onChange={setBudgetHandler} />
                        </div>
                    </div>
                    <div className="flex justify-between flex-col gap-4">
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_startDate`} className="text-[.9rem]">Start date</label>
                            <input type="date" id={`${props.type}_startDate`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" min={todayDate} value={campaignValues.startDate.value} onChange={setStartingDateHandler} />
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_endDate`} className="text-[.9rem]">End date</label>
                            <input type="date" id={`${props.type}_endDate`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" min={nextDayDate} value={campaignValues.endDate.value} onChange={setEndingDateHandler} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-medium text-lg underline decoration-double decoration-amber-500">Ad set details</h2>
                <div className="flex flex-col gap-8">
                    {campaignValues.ads.map((adSet, index) => <AdSetInputContainer key={adSet.ad} type={props.type} index={index} adSet={adSet} adsLength={campaignValues.ads.length} />)}
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