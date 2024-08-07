import { useEffect, useState } from "react";
import { ContactMessagesContainer, GetMessagesPayload, LoadingMessages, MessagesContainer, MessagesResponse, useGetMessagesQuery, websocketMessageAction } from "../../features/message"
import useCustomSearchParams from "../../hooks/useCustomSearchParams";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const Messages = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const [userId, setUserId] = useState("");
    const dispatch = useAppDispatch();

    const websocketMessages = useAppSelector(state => state.websocketMessageReducer);

    const customSearchParams = useCustomSearchParams();

    const messagePayload: GetMessagesPayload = {};

    const search = customSearchParams.getSearchParams({
        key: "search"
    }) || "";


    if (search.trim() !== "") {
        messagePayload.search = search.trim();
    };

    const messages = useGetMessagesQuery(messagePayload);

    const setUserIdHandler = (user: string) => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        setUserId(user);
    };


    useEffect(() => {
        if (messages.isFetching) return;

        const fetch = async () => {
            await messages.refetch({ refetchPage: (_, index) => index === 0 });
            queryClient.setQueryData<InfiniteData<MessagesResponse>>(["messages", userInfo!.userId], (data) => {
                if (!data) return;

                return {
                    pages: data.pages.slice(0, 1),
                    pageParams: data.pageParams.slice(0, 1),
                }
            });
        }

        fetch();
    }, [search]);


    useEffect(() => {
        if (userId === "" && messages.isSuccess && messages.data.pages[0] && messages.data.pages[0].messages.length) {
            setUserId(messages.data.pages[0].messages[0].profile.user);
        }
    }, [messages.isSuccess]);


    useEffect(() => {
        if (!websocketMessages.message) return;

        let isRefetch = false;

        queryClient.setQueryData<InfiniteData<MessagesResponse>>(["messages", userInfo!.userId], (data) => {
            if (!data) return;

            const messageContentIndex = data.pages[0].messages.findIndex((message) => {
                const receiver = websocketMessages.message!.isYouSender
                    ? websocketMessages.message!.receiver
                    : websocketMessages.message!.user;

                if (message.profile.user === receiver) {
                    return true
                };

                return false;
            });

            const messageContent = data.pages[0].messages[messageContentIndex];
            if (messageContent) {
                messageContent._id = websocketMessages.message!._id;
                messageContent.message = {
                    content: websocketMessages.message!.content,
                    createdAt: websocketMessages.message!.createdAt,
                    isYouSender: websocketMessages.message!.isYouSender,
                    isSystem: false
                };

                if (messageContentIndex !== 0) {
                    const messages = data.pages[0].messages.filter((_, index) => index !== messageContentIndex);

                    messages.unshift(messageContent);

                    data.pages[0].messages = messages;
                }
            } else {
                isRefetch = true;
            }

            return data;
        });

        if (isRefetch) {
            messages.refetch();
        }

        dispatch(websocketMessageAction.clearMessage());
    }, [websocketMessages.message]);

    return (
        <main className="p-4 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Messages
            </h1>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {messages.isLoading
                    ? <LoadingMessages />
                    : <>
                        <MessagesContainer messages={messages.data!} fetchNextPage={messages.fetchNextPage} hasNextPage={messages.hasNextPage} isFetchingNextPage={messages.isFetchingNextPage} search={search} setUserIdHandler={setUserIdHandler} selectedUserId={userId} />
                        {messages.data!.pages[0].messages.length
                            ? <ContactMessagesContainer selectedUserId={userId !== ""
                                ? userId
                                : messages.data!.pages[0].messages[0].profile.user
                            } />
                            : null
                        }
                    </>
                }
            </div>
        </main>
    )
}

export default Messages