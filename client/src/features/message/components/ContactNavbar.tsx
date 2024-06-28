import { Link } from "react-router-dom";
import { GetContactMessagesResponse } from "../services/getContactMessages"
import formatPostedTime from "../../../utils/formatPostedTime";

type ContactNavbarProps = {
    contact: GetContactMessagesResponse["contact"];
}

const ContactNavbar = (props: React.PropsWithoutRef<ContactNavbarProps>) => {

    const { diff, pluralize, unit } = formatPostedTime({
        postedAt: props.contact.connection.disconnectedAt
    });

    const status = props.contact.connection.isConnected
        ? "Online"
        : `Active ${diff} ${unit}${pluralize} ago`;

    return (
        <div className="border-b px-1 py-1 shadow-sm flex">
            <Link to={`/profiles/${props.contact._id}`} className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-blue-100/30 hover:rounded">
                <div>
                    <img src={props.contact.avatar} alt={`${props.contact.name} avatar`} className="min-w-[3rem] max-w-[3rem] h-12 object-cover rounded-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-lg">{props.contact.name}</span>
                    <span className="text-sm text-slate-600">{status}</span>
                </div>
            </Link>
        </div>
    )
}

export default ContactNavbar