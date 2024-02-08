import Ratings from "../../../components/Ratings";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";

type RatingFilterProps = {
    rates: number[];
}

const RatingFilter = (props: React.PropsWithoutRef<RatingFilterProps>) => {
    const { rating } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const ratingFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = Number(e.currentTarget.value);

        // check if valid number
        if (Number.isNaN(rate)) {
            return;
        }

        // check if valid rate value
        if (!props.rates.includes(rate) && rate !== 0) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByRating(rate));
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Rating</h4>
            <div className="flex flex-col gap-2">
                <label htmlFor="Any rating" className="flex gap-2">
                    <input type="radio" id="Any rating" value={0} name="rating" className="accent-purple-600" onChange={ratingFilterHandler} checked={!rating} />
                    Any rating
                </label>
                {
                    props.rates.map(rate => (
                        <label key={rate} htmlFor={`${rate} rating`} className="flex gap-2">
                            <input type="radio" id={`${rate} rating`} value={rate} name="rating" className="accent-purple-600" onChange={ratingFilterHandler} checked={rating === rate} />
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