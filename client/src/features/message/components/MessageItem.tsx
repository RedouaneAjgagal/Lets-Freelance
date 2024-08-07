import formatPostedTime from "../../../utils/formatPostedTime";
import { MessageType } from "../services/getMessages"
type MessageItemProps = {
    messageContent: MessageType;
    setUserIdHandler: (user: string) => void;
    selectedUserId: string;
}

const MessageItem = (props: React.PropsWithoutRef<MessageItemProps>) => {
    const { diff, pluralize, unit } = formatPostedTime({
        postedAt: props.messageContent.message.createdAt
    });

    const sentAt = `${diff} ${unit}${pluralize}`;

    const content = props.messageContent.message.isSystem
        ? `System: ${props.messageContent.message.content}`
        : props.messageContent.message.isYouSender
            ? `You: ${props.messageContent.message.content}`
            : props.messageContent.message.content;

    const openChatHandler = () => {
        if (props.selectedUserId === props.messageContent.profile.user) return;
        props.setUserIdHandler(props.messageContent.profile.user);
    }

    const connectionTypes = {
        online: "before:bg-green-400",
        idle: "before:bg-amber-400",
        offline: "before:bg-slate-300",
    } as const;

    const connectionStyle = connectionTypes[props.messageContent.profile.status];

    return (
        <li>
            <button onClick={openChatHandler} className={`py-2 px-4 text-left w-full hover:bg-blue-100/30 ${props.selectedUserId === props.messageContent.profile.user ? "bg-blue-100/30" : "bg-white"}`}>
                <div className="flex items-center gap-2">
                    <div className={`relative before:h-4 before:w-4 before:absolute before:left-0 before:top-0 before:rounded-full before:border-[2px] before:border-white ${connectionStyle}`}>
                        <img src={props.messageContent.profile.avatar} alt={`${props.messageContent.profile.name} avatar`} className="min-w-[3rem] max-w-[3rem] h-12 object-cover rounded-full" />
                    </div>
                    <div className="grid w-full">
                        <div className="flex items-center flex-wrap-reverse justify-between">
                            <span className="font-medium text-lg">{props.messageContent.profile.name}</span>
                            <span className="text-slate-500 text-sm">{sentAt}</span>
                        </div>
                        <p className="truncate text-slate-700">{content}</p>
                    </div>
                </div>
            </button>
        </li>
    )
}

export default MessageItem