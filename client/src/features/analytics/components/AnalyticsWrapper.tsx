import ChartsNavbar, { FilterValues } from "./ChartsNavbar";

type AnalyticsWrapperProps = {
    title: string;
    filterValue: FilterValues;
    onSelectFilter: (filterValue: FilterValues) => void;
    data: { title: string; value: number; }[];
}

const AnalyticsWrapper = (props: React.PropsWithChildren<AnalyticsWrapperProps>) => {
    return (
        <section className="bg-white shadow-sm rounded mt-8">
            <ChartsNavbar title={props.title} filterValue={props.filterValue} onSelectFilter={props.onSelectFilter} />
            {props.data.length ?
                <div>
                    {props.data.map(data => (
                        <div key={data.title} className="mx-6 mt-2 inline-flex flex-col border-b-2 border-purple-500 mb-8 pb-1">
                            <span className="font-bold text-2xl">{data.value.toLocaleString()}</span>
                            <h3 className="font-medium text-slate-700">{data.title}</h3>
                        </div>
                    ))}
                </div>
                : null
            }
            <div className="pb-[60%] relative h-0" >
                <div className="absolute top-0 left-0 w-full h-full py-4">
                    {props.children}
                </div>
            </div>
        </section>
    )
}

export default AnalyticsWrapper