import { Link } from "react-router-dom";
import { AdType } from "../services/getSingleCampaign"
import { useState } from "react";
import ActionButton from "../../../layouts/brand/ActionButton";

type AdSetRowProps = {
    ad: AdType;
    index: number;
}

const AdSetRow = (props: React.PropsWithoutRef<AdSetRowProps>) => {
    const [isActiveAd, setIsActiveAd] = useState(props.ad.status === "active" ? true : false);

    const activateAdToggle = () => {
        setIsActiveAd(prev => !prev);
    }

    const editAdHandler = () => {
        console.log({ edit: props.ad.ad });
    }

    const deleteAdHandler = () => {
        console.log({ delete: props.ad.ad });
    }

    return (
        <tr key={props.ad.ad} className={`${props.ad.status === "active" ? "text-black" : "text-slate-400"} ${props.index % 2 !== 0 ? "bg-slate-200/30" : "bg-slate-100"}`}>
            <td className="border border-slate-300 px-2 py-3 w-80 text-black flex items-center gap-4">
                <div className="flex">
                    <label htmlFor={`ad_activation_${props.ad.ad}`}>
                        <span className={`border-2 rounded-full border-slate-500 w-10 h-5 self-center flex items-center relative ${isActiveAd ? "bg-slate-500" : ""}`}>
                            <span className={`w-3 h-3 rounded-full absolute transition-all ${isActiveAd ? "translate-x-5 bg-white" : "translate-x-1 bg-slate-500"}`}></span>
                        </span>
                    </label>
                    <input onChange={activateAdToggle} type="checkbox" className="appearance-none" id={`ad_activation_${props.ad.ad}`} />
                </div>
                <div>
                    {props.ad.ad} <Link to={`/services/${props.ad.service}`} className="underline">Service</Link>
                </div>
            </td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.status}</td>
            <td className="border border-slate-300 p-2 uppercase">{props.ad.event}</td>
            <td className="border border-slate-300 p-2 capitalize">${props.ad.bidAmount.toFixed(2)}</td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.ctr}%</td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.cr}%</td>
            <td className="border border-slate-300 p-2 capitalize">${props.ad.cpc.toFixed(2)}</td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.displayCount}</td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.clicks}</td>
            <td className="border border-slate-300 p-2 capitalize">{props.ad.orders}</td>
            <td className="border border-slate-300 p-2 capitalize">${props.ad.spend.toFixed(2)}</td>
            <td className="border border-slate-300 p-2 capitalize">
                <div className="flex gap-2">
                    <ActionButton type="edit" onClick={editAdHandler} disabled={false} />
                    <ActionButton type="delete" onClick={deleteAdHandler} disabled={false} minimized />
                </div>
            </td>
        </tr>
    )
}

export default AdSetRow