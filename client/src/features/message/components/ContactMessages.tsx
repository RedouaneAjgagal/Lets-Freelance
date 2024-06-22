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
            data.pages[0].messages = [...data.pages[0].messages, websocketMessages.message!];
            return data
        });

    }, [websocketMessages.message]);

    return (
        <ul ref={messagesSectionRef} className="flex flex-col w-full max-h-[30rem] min-h-[30rem] overflow-y-scroll">
            {props.contactMessagesQuery.hasNextPage
                ? <FetchPrevMessages fetchNextPage={props.contactMessagesQuery.fetchNextPage} hasNextPage={props.contactMessagesQuery.hasNextPage} isFetchingNextPage={props.contactMessagesQuery.isFetchingNextPage} />
                : <div className="p-4 text-center">
                    <p className="flex flex-col text-slate-600">
                        Starting chat with
                        <span className="font-medium text-slate-900">
                            {props.contactMessagesQuery.data!.pages[0].contact.name}
                        </span>
                    </p>
                </div>
            }
            {props.contactMessagesQuery.data!.pages.map((group, index) => (
                <React.Fragment key={index}>
                    <ContactMessageContainer key={index} contact={group.contact} messages={group.messages} />
                </React.Fragment>
            )).reverse()}
        </ul>
    )
}

export default ContactMessages