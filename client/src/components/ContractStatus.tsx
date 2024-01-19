type ContractStatusProps = {
    type: "inProgress" | "completed" | "canceled";
}

const ContractStatus = (props: React.PropsWithoutRef<ContractStatusProps>) => {
    const content = {
        inProgress: {
            color: "bg-blue-300/30 text-blue-500",
            value: "In progress"
        },
        completed: {
            color: "bg-green-300/30 text-green-500",
            value: "Completed"
        },
        canceled: {
            color: "bg-red-300/30 text-red-500",
            value: "Canceled"
        }
    } as const;

    const status = content[props.type];

    return (
        <div className={`${status.color} py-2 px-3 rounded text-center`}>
            <span className="font-medium">{status.value}</span>
        </div>
    )
}

export default ContractStatus