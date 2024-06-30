type LoadingPropsWithOutImage = {
    type?: "table" | undefined;
};

type LoadingPropsWithImage = {
    type?: "singlePage";
    withImage?: boolean;
};

type LoadingCards = {
    type?: "cards";
    display: "grid" | "column";
};

type LoadingProps = (LoadingPropsWithImage | LoadingPropsWithOutImage | LoadingCards);

const Loading = (props: React.PropsWithoutRef<LoadingProps>) => {
    return (
        props.type === "singlePage"
            ? <div className="flex flex-col gap-2 animate-pulse">
                <div className="w-32 h-8 rounded bg-slate-200"></div>
                <div className="py-5 flex flex-col gap-1">
                    <div className="w-full h-8 rounded bg-slate-200"></div>
                    <div className="w-1/3 h-8 rounded bg-slate-200"></div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-full h-5 rounded bg-slate-200"></div>
                    <div className="w-full h-5 rounded bg-slate-200"></div>
                    <div className="w-1/4 h-5 rounded bg-slate-200"></div>
                </div>
                {props.withImage
                    ? <div className="w-full bg-slate-200 h-48 rounded"></div>
                    : null
                }
                <div className="flex flex-col gap-6 py-8">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="w-10 h-10 rounded bg-slate-200"></div>
                            <div className="flex flex-col gap-2">
                                <div className="w-28 h-6 rounded bg-slate-200"></div>
                                <div className="w-20 h-5 rounded bg-slate-200"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div key={index} className="w-28 h-8 rounded-full bg-slate-200"></div>
                    ))}
                </div>
            </div>
            : props.type === "cards"
                ? <div className={`animate-pulse ${props.display === "column" ? "flex flex-col" : "grid grid-cols-1"} gap-6`}>
                    {Array.from({ length: props.display === "column" ? 4 : 8 }, (_, index) => (
                        <div key={index} className={`${props.display === "column" ? "border-b last:border-b-0 pb-6" : "border rounded"} border-slate-200/70`}>
                            {props.display === "grid"
                                ? <div className="w-full h-56 rounded-t bg-slate-200"></div>
                                : null
                            }
                            <div className={`${props.display === "grid" ? "p-3" : ""}`}>
                                <div className="flex flex-col gap-2">
                                    <div className="w-[60%] h-5 rounded bg-slate-200"></div>
                                    <div className="w-full h-7 rounded bg-slate-200"></div>
                                </div>
                                <div className="flex flex-col gap-1 py-4">
                                    <div className="w-full h-6 rounded bg-slate-200"></div>
                                    <div className="w-full h-6 rounded bg-slate-200"></div>
                                    <div className="w-1/4 h-6 rounded bg-slate-200"></div>
                                </div>
                                {props.display === "column"
                                    ? <div className="flex gap-2 flex-wrap">
                                        {Array.from({ length: 4 }, (_, index) => (
                                            <div key={index} className="w-20 h-8 rounded-full bg-slate-200"></div>
                                        ))}
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    ))}
                </div>
                : props.type === "table"
                    ? <div className="animate-pulse">
                        <div className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-6">
                            <div className="flex gap-4 pb-4 pt-2">
                                {Array.from({ length: 4 }, (_, index) => (
                                    <div key={index} className="min-w-[10rem] p-2 pb-4 bg-slate-300 rounded h-9"></div>
                                ))}
                            </div>
                            {Array.from({ length: 6 }, (_, index) => (
                                <div key={index} className="flex">
                                    {Array.from({ length: 4 }, (_, i) => (
                                        <div key={i} className="border-t border-slate-200/70 pt-6 pr-4 flex flex-col gap-2">
                                            {i === 3
                                                ? <div className="flex gap-2 min-w-[10rem]">
                                                    {Array.from({ length: 3 }, (_, btnIndex) => (
                                                        <div key={btnIndex} className="h-8 w-8 bg-slate-200 rounded"></div>
                                                    ))}
                                                </div>
                                                : <div className={`min-w-[10rem] h-5 bg-slate-200 rounded`}></div>
                                            }
                                            {i === 0
                                                ? <div className="w-1/2 h-5 bg-slate-200 rounded"></div>
                                                : null
                                            }
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    : <p>Loading..</p>
    )
}

export default Loading