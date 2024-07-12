import Ratings from "../../../components/Ratings";

type RatingTableProps = {
    avgRate: number;
    ratings: {
        rating: number;
    }[];
}

const RatingTable = (props: React.PropsWithoutRef<RatingTableProps>) => {

    const rates = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    props.ratings.forEach(rate => {
        const getRate = Math.floor(rate.rating) as 1 | 2 | 3 | 4 | 5;
        rates[getRate]++;
    });

    return (
        <section className="grid grid-cols-1 lg:gap-8 lg:grid-cols-5">
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-col lg:col-span-2 lg:bg-purple-100/50 lg:rounded lg:p-4 lg:gap-3">
                <div className="flex flex-col items-center">
                    <h4 className="text-purple-600 font-bold text-5xl">{props.avgRate.toFixed(1)}</h4>
                    <Ratings maxStars={5} rate={props.avgRate} size="text-xl" />
                </div>
                <span className="text-slate-600">{`${props.ratings.length} ${props.ratings.length !== 1 ? "reviews" : "review"}`}</span>
            </div>
            <div className="flex flex-col gap-1 lg:col-span-3 lg:gap-3">
                {
                    Object.entries(rates)
                        .sort(([keyA], [keyB]) => Number(keyB) - Number(keyA))
                        .map(([rateKey, rateValue]) => (
                            <div key={rateKey} className="flex items-center justify-between gap-2">
                                <span className="min-w-[3rem] font-medium text-slate-800">{rateKey} star</span>
                                <div className="w-full bg-slate-200/70 h-[.3rem] rounded-full">
                                    <div style={
                                        {
                                            width: props.ratings.length ?
                                                `${((rateValue / props.ratings.length) * 100).toFixed(2)}%`
                                                :
                                                "0%"
                                        }
                                    } className="bg-purple-600 h-[.3rem] rounded-full"></div>
                                </div>
                                <span className="text-slate-600">({rateValue})</span>
                            </div>
                        ))
                }
            </div>
        </section>
    )
}

export default RatingTable