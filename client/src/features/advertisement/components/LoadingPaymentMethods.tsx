
type LoadingPaymentMethodsProps = {
    numOfCards: number;
}

const LoadingPaymentMethods = (props: React.PropsWithoutRef<LoadingPaymentMethodsProps>) => {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: props.numOfCards }, (_, index) => (
                <div key={index} className="border border-slate-300 rounded py-3 px-4 bg-slate-50 shadow-sm">
                    <div className="flex flex-col gap-4 animate-pulse">
                        <div className="w-24 h-7 bg-slate-200 rounded"></div>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 4 }, (_, i) => (
                                <div key={i} className="w-14 h-5 bg-slate-200 rounded"></div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-5 bg-slate-200 rounded"></div>
                            <span className="text-slate-400">/</span>
                            <div className="w-8 h-5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LoadingPaymentMethods