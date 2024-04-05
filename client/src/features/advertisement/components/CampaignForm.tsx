import { FaArrowDown } from "react-icons/fa";
import AdSetInputContainer from "./AdSetInputContainer";
import { AdverisementPrimaryButton } from "..";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { campaignFormAction } from "../redux/campaignForm";
import { useFreelancerServicesQuery } from "../../service";
import Loading from "../../../components/Loading";

type CampaignFormProps = {
    type: "create";
}

const CampaignForm = (props: React.PropsWithoutRef<CampaignFormProps>) => {
    const freelancerServices = useFreelancerServicesQuery();

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


    const isValidCampaignDetails = (submitType: "create" | "update") => {
        const campaignDetailsHasError = Object.values(campaignValues).some(input => {
            if (Array.isArray(input)) return false;

            return input.error.isError;
        });

        const adsDetailsHasError = campaignValues.ads.some(ad => {
            const hasError = Object.values(ad).some(input => {
                if (typeof input === "string") return false;

                return input.error.isError
            });

            return hasError;
        });

        if (campaignDetailsHasError || adsDetailsHasError) {
            return false;
        }

        return true;
    }

    const submitCampaignFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        dispatch(campaignFormAction.submit());

        const validCampaignDetails = isValidCampaignDetails(props.type);
        if (!validCampaignDetails) {
            return;
        }

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
                        <input type="text" id={`${props.type}_campaignName`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none ${campaignValues.name.error.isError && campaignValues.name.error.errorMsg ? "border-red-400" : "border-white"}`} value={campaignValues.name.value} onChange={setCampaignNameHandler} />
                        <span key="name" className={`text-sm font-medium text-red-500 self-end transition-all  ${campaignValues.name.error.isError && campaignValues.name.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>
                            {campaignValues.name.error.errorMsg}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="w-full flex flex-col">
                            <div className="flex flex-col gap-[.1rem] w-full relative">
                                <label htmlFor={`${props.type}_budgetType`} className="text-[.9rem]">Budget type</label>
                                <select id={`${props.type}_budgetType`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group ${campaignValues.budgetType.error.isError && campaignValues.budgetType.error.errorMsg ? "border-red-400" : "border-white"}`} value={campaignValues.budgetType.value} onChange={setBudgetTypeHandler}>
                                    <option value="daily">Daily</option>
                                    <option value="total">Total</option>
                                </select>
                                <span className="absolute right-2 bottom-3 text-slate-700">
                                    <FaArrowDown size={12} />
                                </span>
                            </div>
                            <span className={`text-sm font-medium text-red-500 self-end transition-all  ${campaignValues.budgetType.error.isError && campaignValues.budgetType.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{campaignValues.budgetType.error.errorMsg}</span>
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full">
                            <label htmlFor={`${props.type}_budget`} className="text-[.9rem]">Budget ($)</label>
                            <input type="number" id={`${props.type}_budget`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full ${campaignValues.budget.error.isError && campaignValues.budget.error.errorMsg ? "border-red-400" : "border-white"}`} value={campaignValues.budget.value === 0 ? "" : campaignValues.budget.value} onChange={setBudgetHandler} />
                            <span className={`text-sm font-medium text-red-500 self-end transition-all  ${campaignValues.budget.error.isError && campaignValues.budget.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{campaignValues.budget.error.errorMsg}</span>
                        </div>
                    </div>
                    <div className="flex justify-between flex-col gap-4">
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_startDate`} className="text-[.9rem]">Start date</label>
                            <input type="date" id={`${props.type}_startDate`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full ${campaignValues.startDate.error.isError && campaignValues.startDate.error.errorMsg ? "border-red-400" : "border-white"}`} min={todayDate} value={campaignValues.startDate.value} onChange={setStartingDateHandler} />
                            <span className={`text-sm font-medium text-red-500 self-end transition-all  ${campaignValues.startDate.error.isError && campaignValues.startDate.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{campaignValues.startDate.error.errorMsg}</span>
                        </div>
                        <div className="flex flex-col gap-[.1rem] w-full relative">
                            <label htmlFor={`${props.type}_endDate`} className="text-[.9rem]">End date</label>
                            <input type="date" id={`${props.type}_endDate`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full ${campaignValues.endDate.error.isError && campaignValues.endDate.error.errorMsg ? "border-red-400" : "border-white"}`} min={nextDayDate} value={campaignValues.endDate.value} onChange={setEndingDateHandler} />
                            <span className={`text-sm font-medium text-red-500 self-end transition-all  ${campaignValues.endDate.error.isError && campaignValues.endDate.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{campaignValues.endDate.error.errorMsg}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-medium text-lg underline decoration-double decoration-amber-500">Ad set details</h2>
                <div className="flex flex-col gap-8">
                    {freelancerServices.isLoading ?
                        <Loading />
                        : <>
                            {
                                campaignValues.ads.map((adSet, index) => <AdSetInputContainer key={adSet.ad} type={props.type} index={index} adSet={adSet} adsLength={campaignValues.ads.length} services={freelancerServices.data!} />)
                            }
                            {
                                campaignValues.ads.length < 10 ?
                                    <button onClick={addAdSetHandler} type="button" className="bg-slate-600 text-white font-medium rounded py-1 px-3 self-start">Add another ad</button>
                                    : null
                            }
                        </>

                    }
                </div>
            </div>
            <AdverisementPrimaryButton type="submit" fullWidth>
                CREATE CAMPAIGN
            </AdverisementPrimaryButton>
        </form>
    )
}

export default CampaignForm