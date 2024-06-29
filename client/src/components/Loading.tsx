type LoadingPropsWithOutImage = {
    type?: undefined;
};

type LoadingPropsWithImage = {
    type?: "singlePage";
    withImage?: boolean;
}

type LoadingProps = (LoadingPropsWithImage | LoadingPropsWithOutImage);

const Loading = (props: React.PropsWithoutRef<LoadingProps>) => {
    return (
        !props.type
            ? <p>Loading..</p>
            : props.type === "singlePage"
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
                : null
    )
}

export default Loading