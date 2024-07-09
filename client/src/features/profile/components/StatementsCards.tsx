import { ProfileStatementsType } from "../services/getProfileStatements";
import Card from "./Card";

type StatementCardsProps = {
    cardsDetails: {
        oneMonthPayments: ProfileStatementsType["oneMonthPayments"];
        oneYearPayments: ProfileStatementsType["oneYearPayments"];
        pendingPayments: ProfileStatementsType["pendingPayments"];
        total: ProfileStatementsType["total"];
    };
}

const StatementsCards = (props: React.PropsWithoutRef<StatementCardsProps>) => {
    const cardsDetails: { title: string; value: number | string; iconUrl: string; }[] = [
        {
            title: "Last 30 Days",
            value: `$${props.cardsDetails.oneMonthPayments.toFixed(0)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/6381/6381398.png"
        },
        {
            title: "Last 365 Days",
            value: `$${props.cardsDetails.oneYearPayments.toFixed(0)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1584/1584813.png"
        },
        {
            title: "Pending",
            value: `$${props.cardsDetails.pendingPayments.toFixed(0)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/7256/7256247.png"
        },
        {
            title: "Total",
            value: `$${props.cardsDetails.total.toFixed(0)}`,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/9313/9313066.png"
        }
    ];

    return (
        <article className="flex flex-col gap-2">
            <ul className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {cardsDetails.map((card, index) => <Card key={index} cardTitle={card.title} value={card.value} iconUrl={card.iconUrl} />)}
            </ul>
        </article>
    )
}

export default StatementsCards