import Loading from "../../components/Loading";
import { MessagesContainer, useGetMessagesQuery } from "../../features/message"

const Messages = () => {

    const messages = useGetMessagesQuery({});

    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Messages
            </h1>
            {messages.isLoading
                ? <Loading />
                : <MessagesContainer  />}
        </main>
    )
}

export default Messages