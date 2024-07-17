import { TbLoader3 } from "react-icons/tb";
import pieChartColors from "../utils/pieChartColors";
import ChartsNavbar, { FilterValues } from "./ChartsNavbar";
import DataContainer from "./DataContainer";

export type ExtraAnalyticsDataType = {
    _id: string;
    count: number;
    percentage: number;
    color: string
};

type AnalyticsWrapperPropsWithoutFilter = {
    isLoading: boolean;
    isFilter: false;
    title: string;
    data: { title: string; value: number | string; }[];
    bottomData: ExtraAnalyticsDataType[];
}

type AnalyticsWrapperPropsWithFilter = {
    isLoading: boolean;
    isFilter: true;
    title: string;
    data: { title: string; value: number | string; }[];
    bottomData: ExtraAnalyticsDataType[];
    filterValue: FilterValues;
    onSelectFilter: (filterValue: FilterValues) => void;
}

type AnalyticsWrapperProps = (AnalyticsWrapperPropsWithoutFilter | AnalyticsWrapperPropsWithFilter);

const AnalyticsWrapper = (props: React.PropsWithChildren<AnalyticsWrapperProps>) => {
    return (
        <section className="bg-white shadow-sm rounded mt-8 pb-4">
            {props.isFilter ?
                <ChartsNavbar title={props.title} isFilter={true} filterValue={props.filterValue} onSelectFilter={props.onSelectFilter} />
                : <ChartsNavbar title={props.title} isFilter={false} />
            }
            {props.data.length ?
                <DataContainer data={props.data} />
                : null
            }
            {props.children ?
                <div className="pb-[85%] relative h-0 sm:pb-[65%] md:pb-[50%] xl:pb-[45%]">
                    <div className="absolute top-0 left-0 w-full h-full py-4">
                        {props.isLoading ?
                            <div className=" bg-slate-900/80 absolute  flex items-center justify-center w-full top-0 left-0 h-full z-20">
                                <TbLoader3 className="animate-spin text-white" size={55} />
                            </div>
                            : null
                        }
                        {props.children}
                    </div>
                </div>
                : null
            }
            {props.bottomData.length ?
                <div className="flex flex-col gap-2">
                    {props.bottomData.map((data, index) => {
                        const color = pieChartColors[index + 1]?.bgColor || "bg-slate-300";

                        return (
                            <div key={data._id} className="grid grid-cols-5 mx-4 border-b last:border-0 pb-2 gap-3">
                                <div className="flex items-center gap-2 col-span-3">
                                    <div className={`min-w-[1rem] h-4 flex ${color}`}></div>
                                    <span>{data._id}</span>
                                </div>
                                <span className="col-span-1">{data.count.toLocaleString()}</span>
                                <span className="text-slate-600 col-span-1">{`${data.percentage}%`}</span>
                            </div>
                        );
                    }
                    )}
                </div>
                : null
            }
        </section>
    )
}

export default AnalyticsWrapper