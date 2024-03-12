
type CancelContractStatusProps = {
    status: "pending" | "rejected" | "approved";
}

const CancelContractStatus = (props: React.PropsWithoutRef<CancelContractStatusProps>) => {
    const content = {
        pending: {
            color: "bg-yellow-300/30 text-yellow-500",
            value: "Pending"
        },
        approved: {
            color: "bg-green-300/30 text-green-500",
            value: "Approved"
        },
        rejected: {
            color: "bg-red-300/30 text-red-500",
            value: "Rejected"
        }
    } as const;

    const status = content[props.status];

    return (
        <div className={`${status.color} py-2 px-3 rounded text-center`}>
            <span className="font-medium">{status.value}</span>
        </div>
    )
}

export default CancelContractStatus