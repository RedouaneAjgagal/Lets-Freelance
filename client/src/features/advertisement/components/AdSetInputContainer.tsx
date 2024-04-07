import { FaArrowDown } from "react-icons/fa";
import { TbArrowBack, TbTrash, TbX } from "react-icons/tb";
import { CampaignFormAdInitialState } from "../redux/campaignForm";
import { useAppDispatch } from "../../../hooks/redux";
import { campaignFormAction } from "../redux/campaignForm";
import { useRef, useState } from "react";
import { FreelancerServiceType } from "../../service";

type AdSetInputContainerProps = {
    index: number;
    type: "create" | "update";
    adSet: CampaignFormAdInitialState;
    adsLength: number;
    services: FreelancerServiceType[];
}

const AdSetInputContainer = (props: React.PropsWithoutRef<AdSetInputContainerProps>) => {
    const keywordInputRef = useRef<HTMLInputElement>(null);

    const [keywordValue, setKeywordValue] = useState("");

    const dispatch = useAppDispatch();

    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];

    const removeAdSet = () => {
        if (props.adsLength <= 1) return;
        dispatch(campaignFormAction.removeAdSet({
            ad: props.adSet.ad
        }));
    }

    const setKeywordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setKeywordValue(keyword);
    }

    const addKeywordHandler = () => {
        keywordInputRef.current!.focus();

        dispatch(campaignFormAction.AddKeyword({
            ad: props.adSet.ad,
            keyword: keywordValue
        }));

        setKeywordValue("");
    }

    const addKeywordOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        addKeywordHandler();

        e.preventDefault();
    }

    const keywords = props.adSet.keywords.value.map(keyword => {
        const removeKeywordHanler = () => {
            dispatch(campaignFormAction.removeKeyword({
                ad: props.adSet.ad,
                keywordId: keyword._id
            }));
        }

        return (
            <button key={keyword._id} onClick={removeKeywordHanler} type="button" className="border border-slate-500 rounded-full px-3 py-[0.1rem] font-medium flex items-center gap-1">
                {keyword.content}
                <TbX size={12} />
            </button>
        )
    });

    const setServiceHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceId = e.target.value;
        const serviceTitle = e.target.options[e.target.selectedIndex].dataset.title || serviceId;

        dispatch(campaignFormAction.setService({
            ad: props.adSet.ad,
            serviceId,
            serviceTitle
        }));
    }

    const services = props.services.map(service => {
        return {
            _id: service._id,
            title: service.title
        }
    })


    const setEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dispatch(campaignFormAction.setEvent({
            ad: props.adSet.ad,
            event: value
        }));
    }

    const setBidAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(campaignFormAction.setBidAmount({
            ad: props.adSet.ad,
            bidAmount: value
        }));
    }


    const setCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dispatch(campaignFormAction.setCategory({
            ad: props.adSet.ad,
            category: value.toLowerCase()
        }));
    }

    return (
        <div className="flex flex-col gap-4 border-t border-slate-300 pt-6 first:border-0 first:pt-2">
            <div className="flex items-center justify-between text-slate-600 font-medium">
                <h3>Ad set N:{props.index + 1}</h3>
                {props.adsLength > 1 ?
                    <button onClick={removeAdSet} type="button" className="text-red-600 h-8 w-8 flex items-center justify-center bg-slate-50 rounded shadow-sm">
                        <TbTrash size={22} />
                    </button>
                    : null
                }
            </div>
            <div className="w-full flex flex-col">
                <div className="flex flex-col gap-[.1rem] w-full relative">
                    <label htmlFor={`${props.type}_service_${props.adSet.ad}`} className="text-[.9rem]">Service</label>
                    <select id={`${props.type}_service_${props.adSet.ad}`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none pr-6 ${props.adSet.service.error.isError && props.adSet.service.error.errorMsg ? "border-red-400" : "border-white"}`} onChange={setServiceHandler} value={props.adSet.service.value._id}>
                        {[{ _id: "Select a service", title: "Select a service" }, ...services].map(service => <option key={service._id} value={service._id} data-title={service.title}>{service.title}</option>)}
                    </select>
                    <span className="absolute right-2 bottom-3 text-slate-700">
                        <FaArrowDown size={12} />
                    </span>
                </div>
                <span className={`text-sm font-medium text-red-500 self-end transition-all  ${props.adSet.service.error.isError && props.adSet.service.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{props.adSet.service.error.errorMsg}</span>
            </div>
            <div className="flex justify-between gap-4">
                <div className="w-full flex flex-col">
                    <div className="flex flex-col gap-[.1rem] w-full relative">
                        <label htmlFor={`${props.type}_event_${props.adSet.ad}`} className="text-[.9rem]">Event</label>
                        <select id={`${props.type}_event_${props.adSet.ad}`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group ${props.adSet.event.error.isError && props.adSet.event.error.errorMsg ? "border-red-400" : "border-white"}`} onChange={setEventHandler} value={props.adSet.event.value}>
                            <option value="cpc">CPC</option>
                            <option value="cpm">CPM</option>
                        </select>
                        <span className="absolute right-2 bottom-3 text-slate-700">
                            <FaArrowDown size={12} />
                        </span>
                    </div>
                    <span className={`text-sm font-medium text-red-500 self-end transition-all  ${props.adSet.event.error.isError && props.adSet.event.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{props.adSet.event.error.errorMsg}</span>
                </div>
                <div className="flex flex-col gap-[.1rem] w-full">
                    <label htmlFor={`${props.type}_bidAmount_${props.adSet.ad}`} className="text-[.9rem]">Bid amount ($)</label>
                    <input type="number" id={`${props.type}_bidAmount_${props.adSet.ad}`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full ${props.adSet.bidAmount.error.isError && props.adSet.bidAmount.error.errorMsg ? "border-red-400" : "border-white"}`} value={props.adSet.bidAmount.value} onChange={setBidAmount} />
                    <span className={`text-sm font-medium text-red-500 self-end transition-all  ${props.adSet.bidAmount.error.isError && props.adSet.bidAmount.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{props.adSet.bidAmount.error.errorMsg}</span>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <div className="flex flex-col gap-[.1rem] w-full relative">
                    <label htmlFor={`${props.type}_category_${props.adSet.ad}`} className="text-[.9rem]">Category</label>
                    <select id={`${props.type}_category_${props.adSet.ad}`} className={`px-2 py-[.3rem] bg-white border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group ${props.adSet.category.error.isError && props.adSet.category.error.errorMsg ? "border-red-400" : "border-white"}`} onChange={setCategoryHandler} value={props.adSet.category.value}>
                        {["Select a category", ...categories].map(category => <option key={category} value={category} className="capitalize">{category}</option>)}
                    </select>
                    <span className="absolute right-2 bottom-3 text-slate-700">
                        <FaArrowDown size={12} />
                    </span>
                </div>
                <span className={`text-sm font-medium text-red-500 self-end transition-all  ${props.adSet.category.error.isError && props.adSet.category.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{props.adSet.category.error.errorMsg}</span>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col w-full">
                    <div className="relative">
                        <div className="flex flex-col gap-[.1rem]">
                            <label htmlFor={`${props.type}_keywords_${props.adSet.ad}`} className="text-[.9rem]">Keywords (minimum of 3)</label>
                            <input disabled={props.adSet.keywords.value.length === 6} ref={keywordInputRef} onKeyDown={addKeywordOnKeyDown} type="text" id={`${props.type}_keywords_${props.adSet.ad}`} className={`px-2 py-[.3rem] pr-16 border-2 focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none ${props.adSet.keywords.error.isError && props.adSet.keywords.error.errorMsg ? "border-red-400" : "border-white"} ${props.adSet.keywords.value.length === 6 ? "bg-slate-50 border-slate-50" : "bg-white"}`} value={keywordValue} onChange={setKeywordHandler} />
                        </div>
                        <button disabled={props.adSet.keywords.value.length === 6} onClick={addKeywordHandler} type="button" className={`absolute right-2 bottom-[0.4rem] rounded px-3 py-1 ${props.adSet.keywords.value.length === 6 ? "bg-amber-200 text-slate-500" : "bg-amber-400 text-slate-800"}`}>
                            <TbArrowBack className="rotate-180" size={18} />
                        </button>
                    </div>
                    <span className={`text-sm font-medium text-red-500 self-end transition-all  ${props.adSet.keywords.error.isError && props.adSet.keywords.error.errorMsg !== "" ? "visible h-5 opacity-100" : "invisible h-0 opacity-0"}`}>{props.adSet.keywords.error.errorMsg}</span>
                </div>
                <div className="flex gap-2 flex-wrap text-sm">
                    {keywords}
                </div>
            </div>
        </div>
    )
}

export default AdSetInputContainer