import { FaArrowDown } from "react-icons/fa";
import { TbArrowBack, TbTrash, TbX } from "react-icons/tb";

type AdSetInputContainerProps = {
    index: number;
    type: "create";
    keywords: { id: string; content: string }[];
}

const AdSetInputContainer = (props: React.PropsWithoutRef<AdSetInputContainerProps>) => {
    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];

    const removeAdSet = () => {
        console.log("remove ad set");
    }

    const addKeywordHandler = () => {
        console.log("add keyword");
    }

    const addKeywordOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key !== "Enter") return;

        addKeywordHandler();
    }



    const keywords = props.keywords.map(keyword => {
        const removeKeywordHanler = () => {
            console.log(`keyword ID ${keyword.id}`);

        }

        return (
            <button key={keyword.id} onClick={removeKeywordHanler} type="button" className="border border-slate-500 rounded-full px-3 py-[0.1rem] font-medium flex items-center gap-1">
                {keyword.content}
                <TbX size={12} />
            </button>
        )
    });

    return (
        <div className="flex flex-col gap-4 border-t border-slate-300 pt-6 first:border-0 first:pt-2">
            <div className="flex items-center justify-between text-slate-600 font-medium">
                <h3>Ad set N:{props.index + 1}</h3>
                <button onClick={removeAdSet} type="button" className="text-red-600 p-1">
                    <TbTrash size={20} />
                </button>
            </div>
            <div className="flex flex-col gap-[.1rem] w-full relative">
                <label htmlFor={`${props.type}_service`} className="text-[.9rem]">Service</label>
                <select id={`${props.type}_service`} defaultValue={"select"} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none ">
                    <option value="">Select a service</option>
                    <option value="daily">React developer</option>
                    <option value="total">UI/UX designer</option>
                </select>
                <span className="absolute right-2 bottom-3 text-slate-700">
                    <FaArrowDown size={12} />
                </span>
            </div>
            <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-[.1rem] w-full relative">
                    <label htmlFor={`${props.type}_event`} className="text-[.9rem]">Event</label>
                    <select id={`${props.type}_event`} defaultValue="cpc" className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group">
                        <option value="cpc">CPC</option>
                        <option value="cpm">CPM</option>
                    </select>
                    <span className="absolute right-2 bottom-3 text-slate-700">
                        <FaArrowDown size={12} />
                    </span>
                </div>
                <div className="flex flex-col gap-[.1rem] w-full">
                    <label htmlFor={`${props.type}_bidAmount`} className="text-[.9rem]">Bid amount ($)</label>
                    <input type="number" id={`${props.type}_bidAmount`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full" />
                </div>
            </div>
            <div className="flex flex-col gap-[.1rem] w-full relative">
                <label htmlFor={`${props.type}_category`} className="text-[.9rem]">Category</label>
                <select id={`${props.type}_category`} defaultValue="cpc" className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none w-full appearance-none group">
                    {categories.map(category => <option key={category} value={category} className="capitalize">{category}</option>)}
                </select>
                <span className="absolute right-2 bottom-3 text-slate-700">
                    <FaArrowDown size={12} />
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <div className="flex flex-col gap-[.1rem]">
                        <label htmlFor={`${props.type}_keywords`} className="text-[.9rem]">Keywords</label>
                        <input onKeyDown={addKeywordOnKeyDown} type="text" id={`${props.type}_keywords`} className="px-2 py-[.3rem] bg-white border-2 border-white focus:border-2 focus:border-blue-300 shadow-sm rounded outline-none" />
                    </div>
                    <button onClick={addKeywordHandler} type="button" className="absolute right-2 bottom-[0.4rem] bg-amber-400 rounded px-3 py-1">
                        <TbArrowBack className="rotate-180" size={18} />
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap text-sm">
                    {keywords}
                </div>
            </div>
        </div>
    )
}

export default AdSetInputContainer