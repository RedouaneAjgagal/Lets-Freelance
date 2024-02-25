
interface Props {
    onClick: (tab: string) => void;
    currentTabOn: string;
    tabs: string[];
}

const ReviewTabs = (props: React.PropsWithoutRef<Props>) => {

    return (
        <div role="tablist" className="border-b flex items-stretch gap-3 text-sm font-medium">
            {props.tabs.map(tab => (
                <button key={tab} onClick={() => props.onClick(tab)} role="tab" className={`border-b-2 py-2 px-1 ${props.currentTabOn === tab ? "border-slate-700 text-black" : "border-transparent text-slate-600"}`}>
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default ReviewTabs