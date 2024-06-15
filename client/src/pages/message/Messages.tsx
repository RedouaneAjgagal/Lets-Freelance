import { useEffect } from "react";
import Loading from "../../components/Loading";
import { ContactMessagesContainer, GetMessagesPayload, MessagesContainer, MessagesResponse, useGetMessagesQuery } from "../../features/message"
import useCustomSearchParams from "../../hooks/useCustomSearchParams";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../hooks/redux";

const Messages = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const messagePayload: GetMessagesPayload = {};

    const search = customSearchParams.getSearchParams({
        key: "search"
    }) || "";


    if (search.trim() !== "") {
        messagePayload.search = search.trim();
        // messagePayload.page = 1;

    };

    const messages = useGetMessagesQuery(messagePayload);


    useEffect(() => {
        messages.refetch({ refetchPage: (_, index) => index === 0 });
    }, [search]);


    useEffect(() => {
        if (!messages.isRefetching) {
            queryClient.setQueryData<InfiniteData<MessagesResponse>>(["messages", userInfo!.userId], (data) => {
                if (!data) return;

                return {
                    pages: data.pages.slice(0, 1),
                    pageParams: data.pageParams.slice(0, 1),
                }
            });
        }
    }, [messages.isRefetching]);


    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Messages
            </h1>
            {messages.isLoading
                ? <Loading />
                : <div className="flex flex-col gap-4">
                    <MessagesContainer messages={messages.data!} fetchNextPage={messages.fetchNextPage} hasNextPage={messages.hasNextPage} isFetchingNextPage={messages.isFetchingNextPage} search={search} />
                    <ContactMessagesContainer />
                </div>
            }
        </main>
    )
}

export default Messages