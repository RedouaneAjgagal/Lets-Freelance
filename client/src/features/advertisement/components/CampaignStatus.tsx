
type CampaignStatusProps = {
    status: "active" | "inactive";
}

const CampaignStatus = (props: React.PropsWithoutRef<CampaignStatusProps>) => {
    const style = {
        active: "bg-green-300/30 text-green-600 shadow-green-300",
        inactive: "bg-slate-300/30 text-slate-600 shadow-slate-300",
    }

    return (
        <span className={`capitalize font-medium px-3 py-2 rounded text-center self-start min-w-[6rem] shadow-sm ${style[props.status]}`}>
            {props.status}
        </span>
    )
}

export default CampaignStatus