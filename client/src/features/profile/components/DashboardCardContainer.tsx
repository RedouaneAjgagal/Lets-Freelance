import Card from "./Card";

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
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 flex-wrap gap-4">
                {props.cardsDetails.map((card, index) => <Card cardTitle={card.title} value={card.value} iconUrl={card.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default DashboardCardContainer