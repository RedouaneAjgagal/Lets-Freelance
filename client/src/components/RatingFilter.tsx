import Ratings from "./Ratings";

type RatingFilterProps = {
    rates: number[];
    rating?: number;
    onSelectRate: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RatingFilter = (props: React.PropsWithoutRef<RatingFilterProps>) => {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl lg:font-semibold">Rating</h4>
            <div className="flex flex-col gap-2">
                <label htmlFor="Any rating" className="flex gap-2">
                    <input type="radio" id="Any rating" value={0} name="rating" className="accent-purple-600" onChange={props.onSelectRate} checked={!props.rating} />
                    Any rating
                </label>
                {
                    props.rates.map(rate => (
                        <label key={rate} htmlFor={`${rate} rating`} className="flex gap-2">
                            <input type="radio" id={`${rate} rating`} value={rate} name="rating" className="accent-purple-600" onChange={props.onSelectRate} checked={props.rating === rate} />
                            <div className="flex items-center">
                                <Ratings maxStars={5} rate={rate} size="text-base" />
                            </div>
                            {rate} & up
                        </label>
                    ))
                }
            </div>
        </div>
    )
}

export default RatingFilter