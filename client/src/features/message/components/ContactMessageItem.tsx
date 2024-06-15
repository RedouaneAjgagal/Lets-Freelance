import formatPostedTime from "../../../utils/formatPostedTime";
import { GetContactMessageType, GetContactMessagesResponse } from "../services/getContactMessages";

type ContactMessageItemProps = {
    contact: GetContactMessagesResponse["contact"];
    message: GetContactMessageType;
    isAttatched: boolean;
}

const ContactMessageItem = (props: React.PropsWithoutRef<ContactMessageItemProps>) => {

    const { diff, pluralize, unit } = formatPostedTime({
        postedAt: props.message.createdAt
    });

    const sentAt = `${diff} ${unit}${pluralize}`;

    return (
        <li className={`mx-4 py-2 ${props.message.isYouSender ? "self-end" : "self-start"} ${props.isAttatched ? "-mt-2 ml-16" : ""}`}>
            <div className={`flex gap-2 items-start w-full`}>
                {props.message.isYouSender || props.isAttatched
                    ? null
                    : <div>
                        <img src={props.contact.avatar} alt={`${props.contact.name} avatar`} className="min-w-[2.5rem] max-w-[2.5rem] h-10 object-cover rounded-full">
                        </img>
                    </div>
                }
                <div className="flex flex-col gap-1">
                    {props.isAttatched
                        ? null
                        : <span title={new Date(props.message.createdAt).toUTCString()} className={`text-sm text-slate-500 ${props.message.isYouSender ? "self-end" : "self-start"}`}>{sentAt}</span>
                    }
                    <div className={`py-2 text-[.975rem] px-4 rounded-xl ${props.isAttatched ? "rounded-xl" : props.message.isYouSender ? "rounded-br-none" : "rounded-tl-none"} ${props.message.isYouSender ? "bg-stone-100/80" : "bg-blue-100/40"}`}>
                        <span>{props.message.content}</span>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default ContactMessageItem