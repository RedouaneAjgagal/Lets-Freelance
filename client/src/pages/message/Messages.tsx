import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { ContactMessagesContainer, GetMessagesPayload, MessagesContainer, MessagesResponse, useGetMessagesQuery, websocketMessageAction, GetContactMessagesResponse } from "../../features/message"
import useCustomSearchParams from "../../hooks/useCustomSearchParams";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const Messages = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const [userId, setUserId] = useState("");
    const dispatch = useAppDispatch();

    const websocketMessages = useAppSelector(state => state.websocketMessageReducer);

    const setUserIdHandler = (user: string) => {
        setUserId(user);
    }

    const customSearchParams = useCustomSearchParams();

    const messagePayload: GetMessagesPayload = {};

    const search = customSearchParams.getSearchParams({
        key: "search"
    }) || "";


    if (search.trim() !== "") {
        messagePayload.search = search.trim();
    };

    const messages = useGetMessagesQuery(messagePayload);


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

        messages.refetch({ refetchPage: (_, index) => index === 0 });
    }, [search]);



    useEffect(() => {
        if (userId === "" && messages.isSuccess && messages.data.pages[0] && messages.data.pages[0].messages.length) {
            setUserId(messages.data.pages[0].messages[0].profile.user);
        }
    }, [messages.isSuccess]);


    useEffect(() => {
        if (!websocketMessages.message) return;

        queryClient.setQueryData<InfiniteData<GetContactMessagesResponse>>([
            "contactMessages",
            userInfo!.userId,
            websocketMessages.message.isYouSender
                ? websocketMessages.message.receiver
                : websocketMessages.message.user
        ], (data) => {
            if (!data) return
            data.pages[0].messages = [...data.pages[0].messages, websocketMessages.message!];
            return data
        });


        queryClient.setQueryData<InfiniteData<MessagesResponse>>(["messages", userInfo!.userId], (data) => {
            if (!data) return;

            const pages = data.pages.map(page => {
                const messageContent = page.messages.find(message => {
                    const receiver = websocketMessages.message!.isYouSender
                        ? websocketMessages.message!.receiver
                        : websocketMessages.message!.user;

                    if (message.profile.user === receiver) {
                        return true
                    };

                    return false;
                });

                if (messageContent) {
                    messageContent._id = websocketMessages.message!._id;
                    messageContent.message = {
                        content: websocketMessages.message!.content,
                        createdAt: websocketMessages.message!.createdAt,
                        isYouSender: websocketMessages.message!.isYouSender
                    }
                }

                return page;
            });

            return {
                pages: pages,
                pageParams: data.pageParams,
            }
        });

        dispatch(websocketMessageAction.clearMessage());
    }, [websocketMessages.message])

    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Messages
            </h1>
            {messages.isLoading
                ? <Loading />
                : <div className="flex flex-col gap-4">
                    <MessagesContainer messages={messages.data!} fetchNextPage={messages.fetchNextPage} hasNextPage={messages.hasNextPage} isFetchingNextPage={messages.isFetchingNextPage} search={search} setUserIdHandler={setUserIdHandler} selectedUserId={userId} />
                    {messages.data!.pages[0].messages.length
                        ? <ContactMessagesContainer selectedUserId={userId !== ""
                            ? userId
                            : messages.data!.pages[0].messages[0].profile.user
                        } />
                        : null
                    }

                </div>
            }
        </main>
    )
}

export default Messages