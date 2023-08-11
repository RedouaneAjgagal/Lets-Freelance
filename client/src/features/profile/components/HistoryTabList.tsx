
interface Props {
    completedJobs: number;
    inProgressJobs: number;
    workHistoryTab: "completedJobs" | "inProgress";
    onSwitchToCompletedJobs: () => void;
    onSwitchToInProgressJobs: () => void;
    historyType: "work" | "contract";
}

const HistoryTabList = (props: React.PropsWithoutRef<Props>) => {

    const completedJobs = `Completed ${props.historyType === "work" ? "Jobs" : "Contracts"} (${props.completedJobs})`;
    const inProgressJobs = `In progress (${props.inProgressJobs})`;

    return (
        <div role="tablist" className="px-4  border-b flex items-stretch gap-3 text-sm font-medium">
            <button onClick={props.onSwitchToCompletedJobs} role="tab" className={`border-b-2 py-2 px-1 ${props.workHistoryTab === "completedJobs" ? "border-slate-700 text-black" : "border-transparent text-slate-600"}`}>
                {completedJobs}
            </button>
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