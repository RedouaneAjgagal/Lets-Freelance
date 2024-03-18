import { TbCalendar } from "react-icons/tb";

type SingleContractSectionWrapperProps = {
    sectionTitle: string;
    hasDate?: false;
}

type SingleContractSectionWrapperPropsWithCreatedAt = {
    sectionTitle: string;
    hasDate?: true;
    date: string;
    dateTitle: string;
}

const SingleContractSectionWrapper = (props: React.PropsWithChildren<SingleContractSectionWrapperProps | SingleContractSectionWrapperPropsWithCreatedAt>) => {
    return (
        <section className="flex flex-col gap-3 text-slate-900 p-3 bg-slate-50 shadow-sm rounded">
            {props.hasDate ?
                <div className="flex items-center gap-1 text-slate-800">
                    <TbCalendar size={18} />
                    <div>
                        <span className="font-medium">{props.dateTitle}</span>
                        <small className="ml-1">{props.date}</small>
                    </div>
                </div> : null
            }
            <h2 className="text-2xl font-medium text-purple-700">{props.sectionTitle}</h2>
            {props.children}
        </section>
    )
}

export default SingleContractSectionWrapper