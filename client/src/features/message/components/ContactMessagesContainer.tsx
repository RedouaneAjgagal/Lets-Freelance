import React from "react";
import Loading from "../../../components/Loading";
import useGetContactMessagesQuery from "../hooks/useGetContactMessagesQuery";

const ContactMessagesContainer = () => {
    const getContactMessagesQuery = useGetContactMessagesQuery({
        userId: ""
    });

    return (
        getContactMessagesQuery.isLoading
            ? <Loading />
            : <section className="bg-white border rounded">
                {getContactMessagesQuery.data!.pages.map((group, index) => (
                    <React.Fragment key={index}>
                        {group.messages.map(message => (
                            <p key={message._id}>{message.content}</p>
                        ))}
                    </React.Fragment>
                ))}
            </section>
    )
}

export default ContactMessagesContainer