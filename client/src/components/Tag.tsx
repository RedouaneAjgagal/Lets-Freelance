
type ClickableTagProps = {
    clickable: true;
    onClick: () => void;
}

type UnclickableTagProps = {
    clickable: false;
}

type TagProps = {
    value: number | string;
} & (ClickableTagProps | UnclickableTagProps);

const Tag = (props: React.PropsWithoutRef<TagProps>) => {

    const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (props.clickable) {
            props.onClick();
        }
    }

    return (
        props.clickable ?
            <button onClick={onClickHandler} className="bg-purple-100/60 py-1 px-3 rounded-full border cursor-pointer">{props.value}</button>
            :
            <span className="bg-purple-100/60 py-1 px-3 rounded-full border">{props.value}</span>

    )
}

export default Tag