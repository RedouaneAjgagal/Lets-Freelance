import React from 'react'

type StatusProps = {
    type: "pending" | "paid" | "refunded";
}

const PaymentsStatus = (props: React.PropsWithoutRef<StatusProps>) => {
    const content = {
        pending: {
            color: "bg-yellow-300/30 text-yellow-500",
            value: "Pending"
        },
        paid: {
            color: "bg-green-300/30 text-green-500",
            value: "Paid"
        },
        refunded: {
            color: "bg-stone-300/30 text-stone-500",
            value: "Refunded"
        }
    } as const;

    const status = content[props.type];

    return (
        <div className={`${status.color} py-2 px-3 rounded text-center min-w-[8rem]`}>
            <span className="font-medium">{status.value}</span>
        </div>
    )
}

export default PaymentsStatus