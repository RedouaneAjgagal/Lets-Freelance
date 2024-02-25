
interface Props {
    completedJobs: number;
    inProgressJobs: number;
    workHistoryTab: "completedJobs" | "inProgress";
    onSwitchToCompletedJobs: () => void;
    onSwitchToInProgressJobs: () => void;
}

const HistoryTabList = (props: React.PropsWithoutRef<Props>) => {
    const completedJobs = `Completed (${props.completedJobs})`;
    const inProgressJobs = `In progress (${props.inProgressJobs})`;

    return (
        <div role="tablist" className="border-b flex items-stretch gap-3 text-sm font-medium">
            {props.completedJobs !== 0 ?
                <button onClick={props.onSwitchToCompletedJobs} role="tab" className={`border-b-2 py-2 px-1 ${props.workHistoryTab === "completedJobs" ? "border-slate-700 text-black" : "border-transparent text-slate-600"}`}>
                    {completedJobs}
                </button>
                :
                null
            }
            {props.inProgressJobs !== 0 ?
                <button onClick={props.onSwitchToInProgressJobs} role="tab" className={`border-b-2 py-2 px-1 ${props.workHistoryTab === "inProgress" ? "border-slate-700 text-black" : "border-transparent text-slate-600"}`}>
                    {inProgressJobs}
                </button>
                :
                null
            }
        </div>
    )
}

export default HistoryTabList