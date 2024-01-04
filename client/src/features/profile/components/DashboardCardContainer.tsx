import DashboardCard from "./DashboardCard";

type DashboardCardContainerProps = {
    sectionTitle: string;
    cardsDetails: {
        title: string,
        value: number | string,
        iconUrl: string;
    }[];
}

const DashboardCardContainer = (props: React.PropsWithoutRef<DashboardCardContainerProps>) => {
    return (
        <article className="flex flex-col gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">{props.sectionTitle}</h2>
            <ul className="flex flex-col flex-wrap gap-4">
                {props.cardsDetails.map((card, index) => <DashboardCard cardTitle={card.title} value={card.value} iconUrl={card.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default DashboardCardContainer