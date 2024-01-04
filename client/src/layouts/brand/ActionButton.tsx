import { TbEye, TbEdit, TbTrash } from "react-icons/tb";

type ActionButtonProps = {
    type: "view" | "edit" | "delete";
    onClick: () => void;
    minimized?: boolean;
}

const ActionButton = (props: React.PropsWithoutRef<ActionButtonProps>) => {
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


    const content = typeContent[props.type];
    const getContent = props.minimized ? content.icon :
        <>
            {content.icon}
            {content.value}
        </>;


    return (
        <button className={`${content.color} text-white p-2 rounded flex gap-1 items-center`} onClick={props.onClick}>
            {getContent}
        </button>
    )
}

export default ActionButton