import { Link } from "react-router-dom";
import { AdType } from "../services/getSingleCampaign"
import { useEffect, useState } from "react";
import ActionButton from "../../../layouts/brand/ActionButton";
import Toggle from "./Toggle";
import useActivateAdMutation from "../hooks/useActivateAdMutation";
import ActionModal from "../../../layouts/ActionModal";
import useDeleteAdMutation from "../hooks/useDeleteAdMutation";
import EditAd from "./EditAd";

type AdSetRowProps = {
    ad: AdType;
    index: number;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    isLastAd: boolean;
}

const AdSetRow = (props: React.PropsWithoutRef<AdSetRowProps>) => {
    const [isActiveAd, setIsActiveAd] = useState(props.ad.status === "active" ? true : false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditAdOpen, setIsEditAdOpen] = useState(false);

    const deleteAdMutation = useDeleteAdMutation();

    const activateAdMutation = useActivateAdMutation();

    const activateAdToggle = () => {
        if (activateAdMutation.isLoading) return;

        const status = isActiveAd ? "inactive" : "active";

        activateAdMutation.mutate({
            adId: props.ad.ad,
            status
        });

        setIsActiveAd(prev => !prev);
    }

    const editAdHandler = () => {
        setIsEditAdOpen(true);
    }

    const deleteAdHandler = () => {
        if (deleteAdMutation.isLoading || props.isLastAd) return;

        deleteAdMutation.mutate({
            adId: props.ad.ad
        });
    }

    useEffect(() => {
        if (deleteAdMutation.isSuccess) {
            props.tableContainerRef.current!.scrollTo({ left: 0, behavior: "instant" });
            setIsDeleteModalOpen(false);
        }
    }, [deleteAdMutation.isSuccess]);

    return (
        <>
            {isDeleteModalOpen ?
                <ActionModal cancelBtnContent="Cancel" color="red" confirmBtnContent="Delete Ad" title="Ad deletion" desc={`Are you sure you want to delete ad ID "${props.ad.ad}"? This action can't be undone.`} disabled={deleteAdMutation.isLoading} onClose={() => setIsDeleteModalOpen(false)} onConfirm={deleteAdHandler} isLoading={deleteAdMutation.isLoading} />
                : null
            }
            {isEditAdOpen ?
                <EditAd onClose={() => setIsEditAdOpen(false)} ad={props.ad} tableContainerRef={props.tableContainerRef} />
                : null
            }
            <tr key={props.ad.ad} className={`${props.ad.status === "active" ? "text-black" : "text-slate-400"} ${props.index % 2 !== 0 ? "bg-slate-200/30" : "bg-slate-100"}`}>
                <td className="border border-slate-300 px-2 py-3 w-80 text-black flex items-center gap-4">
                    <Toggle id={`activate_ad_${props.ad.ad}`} isChecked={isActiveAd} onChange={activateAdToggle} isLoading={activateAdMutation.isLoading} />
                    <div>
                        {props.ad.ad} <Link to={`/services/${props.ad.service}`} className="underline">Service</Link>
                    </div>
                </td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.status}</td>
                <td className="border border-slate-300 p-2 uppercase">{props.ad.event}</td>
                <td className="border border-slate-300 p-2 capitalize">${props.ad.bidAmount.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.ctr.toFixed(2)}%</td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.cr.toFixed(2)}%</td>
                <td className="border border-slate-300 p-2 capitalize">${props.ad.cpc.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.displayCount}</td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.clicks}</td>
                <td className="border border-slate-300 p-2 capitalize">{props.ad.orders}</td>
                <td className="border border-slate-300 p-2 capitalize">${props.ad.spend.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 capitalize">
                    <div className="flex gap-2">
                        <ActionButton type="edit" onClick={editAdHandler} disabled={false} />
                        {props.isLastAd ?
                            null
                            : <ActionButton type="delete" onClick={() => setIsDeleteModalOpen(true)} disabled={false} minimized />
                        }
                    </div>
                </td>
            </tr>
        </>
    )
}

export default AdSetRow