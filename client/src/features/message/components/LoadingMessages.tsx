
const LoadingMessages = () => {
    const contactsAnimation = Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="py-3 px-4">
            <div className="flex items-center gap-2">
                <div className="min-w-[3rem] max-w-[3rem] h-12 rounded-full bg-slate-200"></div>
                <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <div className="w-32 h-5 bg-slate-200 rounded"></div>
                        <div className="w-14 h-5 bg-slate-200 rounded"></div>
                    </div>
                    <div className="bg-slate-200 w-28 h-5 rounded"></div>
                </div>
            </div>
        </div>
    ));


    return (
        <div className="bg-white border rounded xl:min-h-[33rem] xl:max-h-[33rem]">
            <div className="animate-pulse">
                <div className="p-4">
                    <div className="bg-slate-200 h-11 rounded"></div>
                </div>
                {contactsAnimation}
            </div>
        </div>
    )
}

export default LoadingMessages