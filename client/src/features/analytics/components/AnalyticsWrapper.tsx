import ChartsNavbar, { FilterValues } from "./ChartsNavbar";

type AnalyticsWrapperProps = {
    title: string;
    filterValue: FilterValues;
    onSelectFilter: (filterValue: FilterValues) => void;
}

const AnalyticsWrapper = (props: React.PropsWithChildren<AnalyticsWrapperProps>) => {
    return (
        <section className="bg-white shadow-sm rounded mt-8">
            <ChartsNavbar title={props.title} filterValue={props.filterValue} onSelectFilter={props.onSelectFilter} />
            <div className="pb-[60%] relative h-0" >
                <div className="absolute top-0 left-0 w-full h-full py-4">
                    {props.children}
                </div>
            </div>
        </section>
    )
}

export default AnalyticsWrapper