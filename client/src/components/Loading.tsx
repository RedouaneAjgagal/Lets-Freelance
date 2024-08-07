import { TbLoader2 } from "react-icons/tb";
type LoadingType = {
    type?: undefined;
    withoutBackground?: boolean;
};

type LoadingPropsWithOutImage = {
    type: "table";
} | LoadingType;

type LoadingPropsWithImage = {
    type: "singlePage";
    withImage?: boolean;
} | LoadingType;

type LoadingCards = {
    type: "cards";
    display: "grid" | "column";
    numOfCards: number;
} | LoadingType;

type LoadingStatements = {
    type: "statements";
    numOfCards: number;
} | LoadingType;

type LoadingProps = (
    LoadingPropsWithImage
    | LoadingPropsWithOutImage
    | LoadingCards
    | LoadingStatements
);

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
                ? <div className={`animate-pulse ${props.display === "column" ? "flex flex-col" : "grid grid-cols-1"} gap-6 md:grid-cols-2 xl:md:grid-cols-3`}>
                    {Array.from({ length: props.numOfCards }, (_, index) => (
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
                                        {Array.from({ length: props.numOfCards }, (_, index) => (
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
                    ? <div className="animate-pulse overflow-x-scroll lg:overflow-auto">
                        <div className="bg-white rounded p-6 shadow-sm grid gap-8 min-w-[40rem]">
                            <div className="grid grid-cols-4 gap-4 py-2 xl:gap-10">
                                {Array.from({ length: 4 }, (_, index) => (
                                    <div key={index} className="min-w-[3rem] max-w-[12rem] p-2 pb-4 bg-slate-300 rounded h-9"></div>
                                ))}
                            </div>
                            {Array.from({ length: 6 }, (_, index) => (
                                <div key={index} className="grid grid-cols-4 border-t gap-4 xl:gap-10">
                                    {Array.from({ length: 4 }, (_, i) => (
                                        <div key={i} className="pt-6 flex flex-col gap-2">
                                            {i === 3
                                                ? <div className="flex gap-2 min-w-[3rem]">
                                                    {Array.from({ length: 3 }, (_, btnIndex) => (
                                                        <div key={btnIndex} className="h-8 w-8 bg-slate-200 rounded"></div>
                                                    ))}
                                                </div>
                                                : <div className={`min-w-[3rem] h-5 bg-slate-200 rounded`}></div>
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
                    : props.type === "statements"
                        ? <div className="animate-pulse">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from({ length: props.numOfCards }, (_, index) => (
                                    <div key={index} className="bg-white p-4 rounded shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col gap-3">
                                                <div className="bg-slate-200 rounded h-8 w-36"></div>
                                                <div className="bg-slate-200/70 rounded h-5 w-24"></div>
                                            </div>
                                            <div className="w-14 h-14 rounded-full bg-slate-200"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        : <div className={`flex items-center justify-center rounded animate-pulse ${props.withoutBackground ? "" : "bg-slate-100 min-h-[70vh]"}`}>
                            <TbLoader2 className="animate-spin" size={36} />
                        </div>
    )
}

export default Loading