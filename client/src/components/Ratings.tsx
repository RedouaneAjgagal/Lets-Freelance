import React from 'react'
import { TbStarFilled } from 'react-icons/tb';

interface Props {
    maxStars: number;
    rate: number;
    size: "text-sm" | "text-base" | "text-lg" | "text-xl";
}

const Ratings = (props: React.PropsWithoutRef<Props>) => {
    // Calculate the whole and fraction parts of the rating
    const wholeRating = Math.floor(props.rate);
    const fractionRating = props.rate - wholeRating;

    const stars = Array.from({ length: props.maxStars }, (_, index) => {
        if (index < wholeRating) {
            // Completely filled star
            return <TbStarFilled key={index} className={`${props.size} text-purple-600 w-full`} />;
        } else if (index === wholeRating) {
            // Partially filled star
            return (
                <div key={index} className="relative w-full">
                    <TbStarFilled className={`${props.size} text-purple-600 relative z-20`} style={{ clipPath: `inset(0 ${100 - fractionRating * 100}% 0 0)` }} />
                    <TbStarFilled className={`${props.size} absolute z-10 top-0 left-0 text-slate-200 w-full`} />
                </div>
            );
        } else {
            // Empty star
            return <TbStarFilled key={index} className={`${props.size} text-slate-200 w-full`} />;
        }
    });

    return (
        <div className="flex gap-[.1rem] relative">
            {stars}
        </div>
    )
}

export default Ratings