type FavoriteButtonProps = {
    value: "Services" | "Jobs" | "Freelancers" | "Employers";
    isActive: boolean;
    onClick: (favoriteType: "Services" | "Jobs" | "Freelancers" | "Employers") => void;
}

const FavoriteButton = (props: FavoriteButtonProps) => {

    const favoriteNavigatorHandler = () => {
        props.onClick(props.value);
    }

    return (
        <div className="flex flex-col">
            <button onClick={favoriteNavigatorHandler} className={`${props.isActive ? "text-slate-800" : "text-slate-500"} font-medium duration-200`}>{props.value}</button>
            <span className={`${props.isActive ? "border-b-slate-800 w-full" : "border-b-transparent w-0"} border-b-2 duration-200`}></span>
        </div>
    )
}

export default FavoriteButton;