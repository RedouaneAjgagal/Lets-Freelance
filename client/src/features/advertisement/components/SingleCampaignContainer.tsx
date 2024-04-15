import { GetSingleCampaignResponse } from "../services/getSingleCampaign";
import CampaignStatus from "./CampaignStatus";
import SingleCampaignTable from "./SingleCampaignTable";
import { TbDotsVertical, TbEdit, TbPlus, TbTrash } from "react-icons/tb";
import useDeleteCampaignMutation from "../hooks/useDeleteCampaignMutation";
import { useRef, useState } from "react";
import ActionModal from "../../../layouts/ActionModal";
import EditCampaign from "./EditCampaign";
import CreateAd from "./CreateAd";
import useOverflow from "../../../hooks/useOverflow";

type SingleCampaignContainerProps = {
    campaign: GetSingleCampaignResponse;
}

const SingleCampaignContainer = (props: React.PropsWithoutRef<SingleCampaignContainerProps>) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddMoreAdSetOpen, setIsAddMoreAdSetOpen] = useState(false);
    const deleteCampaignMutation = useDeleteCampaignMutation();

    const editCampaignHandler = () => {
        setIsEditModalOpen(true);
    }

    const addMoreAdSetHandler = () => {
        if (props.campaign.ads.length >= 10) return;
        setIsAddMoreAdSetOpen(true);
    }

    const deleteCampaignHandler = () => {
        deleteCampaignMutation.mutate({
            campaignId: props.campaign._id
        });
    }

    const tableContainerRef = useRef<HTMLDivElement>(null);

    useOverflow(isDeleteModalOpen);
    useOverflow(isEditModalOpen);
    useOverflow(isAddMoreAdSetOpen);

    return (
        <>
            {isDeleteModalOpen ?
                <ActionModal cancelBtnContent="Cancel" color="red" confirmBtnContent="Delete" title="Campaign deletion" desc={`Are you sure you want to delete campaign "${props.campaign.name}"? This action can't be undone.`} disabled={deleteCampaignMutation.isLoading} isLoading={deleteCampaignMutation.isLoading} onClose={() => setIsDeleteModalOpen(false)} onConfirm={deleteCampaignHandler} />
                : null
            }
            {isEditModalOpen ?
                <EditCampaign onClose={() => setIsEditModalOpen(false)} campaignDetails={{
                    name: props.campaign.name,
                    budgetType: props.campaign.budgetType,
                    budget: props.campaign.budget,
                    endDate: props.campaign.endDate
                }} />
                : null
            }
            {isAddMoreAdSetOpen ?
                <CreateAd onClose={() => setIsAddMoreAdSetOpen(false)} tableContainerRef={tableContainerRef} />
                : null
            }
            <article className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <CampaignStatus status={props.campaign.status} />
                    <div className="flex relative group">
                        <button className="py-2 px-1">
                            <TbDotsVertical size={20} />
                        </button>
                        <div className="absolute bg-white shadow-xl min-w-[16rem] right-0 flex flex-col rounded top-9 border-2 font-medium invisible opacity-0 transition-all -translate-y-5  group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                            <button onClick={editCampaignHandler} className="text-left py-2 px-3 border-b text-blue-600 flex items-center gap-1">
                                <TbEdit size={20} />
                                Edit Campaign
                            </button>
                            <button onClick={() => setIsDeleteModalOpen(true)} className="text-left py-2 px-3 flex items-center gap-1 text-red-600">
                                <TbTrash size={20} />
                                Delete Campaign
                            </button>
                        </div>
                    </div>
                </div>
                <h2 className="text-lg font-medium">Campaign: <em className="text-slate-700 text-xl font-normal">"{props.campaign.name}"</em></h2>
                <SingleCampaignTable tableContainerRef={tableContainerRef} ads={props.campaign.ads} totalMetrics={{
                    cpc: props.campaign.cpc,
                    cr: props.campaign.cr,
                    ctr: props.campaign.ctr,
                    totalClicks: props.campaign.totalClicks,
                    totalImpressions: props.campaign.totalImpressions,
                    totalOrders: props.campaign.totalOrders,
                    totalSpend: props.campaign.totalSpend
                }} />
                {props.campaign.ads.length < 10 ?
                    <button onClick={addMoreAdSetHandler} className="flex items-center gap-1 self-start bg-slate-300 rounded px-2 py-1 font-semibold border border-slate-400 text-slate-900">
                        <TbPlus size={20} className="text-slate-800" />
                        Add more
                    </button>
                    : null
                }
            </article>
        </>
    )
}

export default SingleCampaignContainer