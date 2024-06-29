
const LoadingContactMessages = () => {
    const contactsAnimation = Array.from({ length: 6 }, (_, index) => {
        if (index % 2 === 0) {
            return (
                <div key={index} className="flex items-start gap-2 p-4">
                    <div className="w-full flex flex-col gap-1 items-end">
                        <div className="w-24 h-5 bg-slate-200 rounded"></div>
                        <div className="bg-slate-200 w-[80%] h-8 rounded-lg rounded-br-none"></div>
                    </div>
                </div>
            )
        }

        return (
            <div key={index} className="flex items-start gap-2 p-4">
                <div className="min-w-[2.5rem] max-w-[2.5rem] h-10 rounded-full bg-slate-200"></div>
                <div className="w-full flex flex-col gap-1">
                    <div className="w-24 h-5 bg-slate-200 rounded"></div>
                    <div className="bg-slate-200 w-[80%] h-8 rounded-lg rounded-tl-none"></div>
                </div>
            </div>
        )
    })

    return (
        <div className="bg-white border rounded animate-pulse">
            <div className="flex items-center gap-2 p-4 border-b">
                <div className="min-w-[3rem] max-w-[3rem] h-12 rounded-full bg-slate-200"></div>
                <div className="w-full flex flex-col gap-1">
                    <div className="w-32 h-5 bg-slate-200 rounded"></div>
                    <div className="bg-slate-200 w-20 h-5 rounded"></div>
                </div>
            </div>
            <div>
                {contactsAnimation}
            </div>
        </div>
    )
}

export default LoadingContactMessages