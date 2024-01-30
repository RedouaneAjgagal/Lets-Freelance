
type RatingTableProps = {
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

    console.log(rates);


    return (
        <section className="flex flex-col gap-1">
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
        </section>
    )
}

export default RatingTable