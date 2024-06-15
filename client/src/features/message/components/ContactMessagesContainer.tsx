import Loading from "../../../components/Loading";
import useGetContactMessagesQuery from "../hooks/useGetContactMessagesQuery";
import SendMessageContainer from "./SendMessageContainer";
import ContactNavbar from "./ContactNavbar";
import ContactMessages from "./ContactMessages";

const ContactMessagesContainer = () => {
    const getContactMessagesQuery = useGetContactMessagesQuery({
        userId: "123"
    });

    return (
        getContactMessagesQuery.isLoading
            ? <Loading />
            : <section className="bg-white border rounded">
                <ContactNavbar contact={getContactMessagesQuery.data!.pages[0].contact} />
                <ContactMessages contactMessagesQuery={getContactMessagesQuery} />
                <SendMessageContainer />
            </section>
    )
}

export default ContactMessagesContainer