import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type Props = {
    onClick: () => void;
    fillHeart: boolean;
}

const FavoriteHeartButton = (props: React.PropsWithoutRef<Props>) => {
    const favorites = {
        "true": <AiFillHeart className="text-red-500 text-xl z-10" />,
        "false": <AiOutlineHeart className="text-slate-500 text-xl z-10" />
    } as const;

    const clickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        props.onClick();
    }

    return (
        <button onClick={clickHandler} className="absolute top-3 right-3 p-2 bg-white rounded-full border shadow-sm z-30">{favorites[props.fillHeart ? "true" : "false"]}</button>
    )
}

export default FavoriteHeartButton