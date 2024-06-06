
type ContractCancellationRequestedByProps = {
    cancelRequest: {
        subject: string;
        reason: string;
    };
    user: "freelancer" | "employer";
};

const ContractCancellationRequestedBy = (props: React.PropsWithoutRef<ContractCancellationRequestedByProps>) => {
    return (
        <article className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-purple-800">Requested by {props.user}</h3>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <h5 className="font-medium">Subject:</h5>
                    <span className="text-slate-600">{props.cancelRequest.subject}</span>
                </div>
                <div className="flex flex-col">
                    <h5 className="font-medium">Reason:</h5>
                    <span className="text-slate-600">{props.cancelRequest.reason}</span>
                </div>
            </div>
        </article>
    )
}

export default ContractCancellationRequestedBy