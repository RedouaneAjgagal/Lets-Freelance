import { GetContactMessagesResponse } from "../services/getContactMessages"
import ContactMessageItem from "./ContactMessageItem";

type ContactMessageContainerProps = {
    contact: GetContactMessagesResponse["contact"];
    messages: GetContactMessagesResponse["messages"];
}

const ContactMessageContainer = (props: React.PropsWithoutRef<ContactMessageContainerProps>) => {

    const messages = props.messages.map((message, index) => {
        const recentMessage = props.messages[index - 1];

        const oneMin = 1 * 60 * 1000; // 1 min

        const isAttatched = recentMessage?.user === message.user
            && (new Date(message.createdAt).getTime() - new Date(recentMessage?.createdAt).getTime()) < oneMin;

        return (
            <ContactMessageItem key={message._id} contact={props.contact} message={message} isAttatched={isAttatched} />
        )
    });


    return (
        <>
            {messages}
        </>
    )
}

export default ContactMessageContainer