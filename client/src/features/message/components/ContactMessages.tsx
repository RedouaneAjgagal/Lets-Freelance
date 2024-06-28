import React, { useEffect, useRef } from "react"
import FetchPrevMessages from "./FetchPrevMessages"
import ContactMessageContainer from "./ContactMessageContainer"
import { InfiniteData, UseInfiniteQueryResult, useQueryClient } from "@tanstack/react-query"
import { GetContactMessagesResponse } from "../services/getContactMessages"
import { useAppSelector } from "../../../hooks/redux"

type ContactMessagesProps = {
    contactMessagesQuery: UseInfiniteQueryResult<GetContactMessagesResponse, unknown>;
}

const ContactMessages = (props: React.PropsWithoutRef<ContactMessagesProps>) => {
    const messagesSectionRef = useRef<HTMLUListElement>(null);
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);
    const websocketMessages = useAppSelector(state => state.websocketMessageReducer);

    const scrollToBottom = () => {
        if (messagesSectionRef.current && props.contactMessagesQuery.isFetched && !props.contactMessagesQuery.isRefetching) {
            messagesSectionRef.current.scrollTo({
                behavior: "instant",
                top: messagesSectionRef.current.scrollHeight
            });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [props.contactMessagesQuery.isRefetching]);

    useEffect(() => {
        if (!websocketMessages.message) {
            scrollToBottom();
            return;
        };

        queryClient.setQueryData<InfiniteData<GetContactMessagesResponse>>([
            "contactMessages",
            userInfo!.userId,
            websocketMessages.message.isYouSender
                ? websocketMessages.message.receiver
                : websocketMessages.message.user
        ], (data) => {
            if (!data) return
            const isExistMessage = data.pages[0].messages.find(message => message._id === websocketMessages.message?._id);
            if (!isExistMessage) {
                data.pages[0].messages = [...data.pages[0].messages, websocketMessages.message!];
            }

            return data
        });

    }, [websocketMessages.message]);

    return (
        <ul ref={messagesSectionRef} className="flex flex-col w-full max-h-[30rem] min-h-[30rem] overflow-y-scroll">
            {props.contactMessagesQuery.hasNextPage
                ? <FetchPrevMessages fetchNextPage={props.contactMessagesQuery.fetchNextPage} hasNextPage={props.contactMessagesQuery.hasNextPage} isFetchingNextPage={props.contactMessagesQuery.isFetchingNextPage} />
                : null
            }
            {props.contactMessagesQuery.data!.pages.map((group, index) => (
                <React.Fragment key={index}>
                    <ContactMessageContainer key={index} contact={props.contactMessagesQuery.data!.pages[props.contactMessagesQuery.data!.pages.length - 1].contact} messages={group.messages} />
                </React.Fragment>
            )).reverse()}
        </ul>
    )
}

export default ContactMessages