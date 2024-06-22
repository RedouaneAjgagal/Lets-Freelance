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
        props.setUserIdHandler(props.messageContent.profile.user);
    }

    return (
        <li>
            <button onClick={openChatHandler} className={`py-2 px-4 text-left w-full hover:bg-blue-100/30 ${props.selectedUserId === props.messageContent.profile.user ? "bg-blue-100/30" : "bg-white"}`}>
                <div className="flex items-center gap-2">
                    <div>
                        <img src={props.messageContent.profile.avatar} alt={`${props.messageContent.profile.name} avatar`} className="min-w-[3rem] max-w-[3rem] h-12 object-cover rounded-full" />
                    </div>
                    <div className="w-full">
                        <div className="flex items-center flex-wrap-reverse justify-between">
                            <span className="font-medium text-lg">{props.messageContent.profile.name}</span>
                            <span className="text-slate-500 text-sm">{sentAt}</span>
                        </div>
                        <p className="line-clamp-1 text-slate-700">{content}</p>
                    </div>
                </div>
            </button>
        </li>
    )
}

export default MessageItem