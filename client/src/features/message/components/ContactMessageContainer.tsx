import { GetContactMessagesResponse } from "../services/getContactMessages"
import ContactMessageItem from "./ContactMessageItem";

type ContactMessageContainerProps = {
    contact: GetContactMessagesResponse["contact"];
    messages: GetContactMessagesResponse["messages"];
}

const ContactMessageContainer = (props: React.PropsWithoutRef<ContactMessageContainerProps>) => {

    const messages = props.messages.map((message, index) => {
        if (index === 0) {
            return (
                <ContactMessageItem key={message._id} contact={props.contact} message={message} isAttatched={false} />
            )
        }

        const recentMessage = props.messages[index - 1];

        const currentMessageSentDate = new Date(message.createdAt);
        const currentMessageSentTime = new Date(message.createdAt)
            .setHours(currentMessageSentDate.getHours(), currentMessageSentDate.getMinutes(), 0, 0);

        const recentMessageSentDate = new Date(recentMessage.createdAt);
        const recentMessageSentTime = new Date(recentMessage.createdAt)
            .setHours(recentMessageSentDate.getHours(), recentMessageSentDate.getMinutes(), 0, 0);

        const isAttatched = !recentMessage.isSystem
            && recentMessage.user === message.user
            && currentMessageSentTime === recentMessageSentTime;

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