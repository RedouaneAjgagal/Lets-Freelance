import { IconType } from "react-icons";
import { TbEye, TbEdit, TbTrash } from "react-icons/tb";

type ActionButtonProps = {
    type: "view" | "edit" | "delete";
    onClick: () => void;
    minimized?: boolean;
}

type ActionCustomizedButtonProps = {
    type: "customized";
    value: string;
    bgColor: string;
    icon: IconType;
    onClick: () => void;
    minimized?: boolean;
}


const ActionButton = (props: React.PropsWithoutRef<ActionButtonProps | ActionCustomizedButtonProps>) => {
    const typeContent = {
        view: {
            value: "View",
            icon: <TbEye />,
            color: "bg-purple-500"
        },
        edit: {
            value: "Edit",
            icon: <TbEdit />,
            color: "bg-blue-500"
        },
        delete: {
            value: "Delete",
            icon: <TbTrash />,
            color: "bg-red-500"
        }
    } as const;




    const content = props.type === "customized" ? {
        color: props.bgColor,
        value: props.value,
        icon: <props.icon />
    } : typeContent[props.type];

    const getContent = props.minimized ? content.icon :
        <>
            {content.icon}
            <span className="text-sm">{content.value}</span>
        </>;


    return (
        <button className={`${content.color} text-white h-8 px-2 rounded flex gap-1 items-center`} onClick={props.onClick}>
            {getContent}
        </button>
    )
}

export default ActionButton