

const TestPaymentMethod = () => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Test account</h2>
            <div className="p-4 px-5 flex flex-col bg-slate-50 self-start rounded shadow-sm">
                <div className="flex gap-x-8 gap-y-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium">Card number</h3>
                        <p className="text-slate-700">4242 4242 4242 4242</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium">Expiration</h3>
                        <p className="text-slate-700">
                            {`12 / ${(new Date().getFullYear() + 1).toString().slice(2)}`}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium">CVC</h3>
                        <p className="text-slate-700">123</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestPaymentMethod