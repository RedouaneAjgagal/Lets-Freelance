import { GetContactMessageType, GetContactMessagesResponse } from "../services/getContactMessages";

type ContactMessageItemProps = {
    contact: GetContactMessagesResponse["contact"];
    message: GetContactMessageType;
    isAttatched: boolean;
}

const ContactMessageItem = (props: React.PropsWithoutRef<ContactMessageItemProps>) => {
    const today = new Date(Date.now())
        .setHours(0, 0, 0, 0);

    const sentDateTime = new Date(props.message.createdAt)
        .setHours(0, 0, 0, 0);

    const formatDateOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit"
    };

    if (today !== sentDateTime) {
        formatDateOptions.year = "numeric";
        formatDateOptions.month = "short";
        formatDateOptions.day = "numeric";
    }

    const sentAt = new Date(props.message.createdAt)
        .toLocaleString("en-US", formatDateOptions);

    return (
        <li className={`mx-4 py-2 ${props.message.isSystem ? "self-center" : props.message.isYouSender ? "self-end" : "self-start"} ${props.isAttatched ? "-mt-2 ml-16" : ""}`}>
            {props.message.isFirstMessage ?
                <div className="p-4 text-center">
                    <p className="flex flex-col text-slate-600">
                        Starting chat with
                        <span className="font-medium text-slate-900">
                            {props.contact.name}
                        </span>
                    </p>
                </div>
                : null
            }
            <div className={`flex gap-2 items-start w-full justify-center`}>
                {props.message.isSystem || props.message.isYouSender || props.isAttatched
                    ? null
                    : <div>
                        <img src={props.contact.avatar} alt={`${props.contact.name} avatar`} className="min-w-[2.5rem] max-w-[2.5rem] h-10 object-cover rounded-full">
                        </img>
                    </div>
                }
                <div className="flex flex-col items-start gap-1">
                    {props.isAttatched
                        ? null
                        : <span title={new Date(props.message.createdAt).toUTCString()} className={`text-[.8rem] text-slate-500 ${props.message.isSystem ? "self-center" : props.message.isYouSender ? "self-end" : "self-start"}`}>{sentAt}</span>
                    }
                    <div className={`py-2 text-[.975rem] px-4 rounded-xl ${props.message.isSystem || props.isAttatched ? "rounded-xl" : props.message.isYouSender ? "rounded-br-none self-end" : "rounded-tl-none self-start"} ${props.message.isSystem ? "bg-purple-100/80 text-purple-600 font-medium text-center text-base" : props.message.isYouSender ? "bg-stone-100/80" : "bg-blue-100/40"}`}>
                        <span>{props.message.content}</span>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default ContactMessageItem