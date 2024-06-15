import React, { useEffect, useRef } from "react"
import FetchPrevMessages from "./FetchPrevMessages"
import ContactMessageContainer from "./ContactMessageContainer"
import { UseInfiniteQueryResult } from "@tanstack/react-query"
import { GetContactMessagesResponse } from "../services/getContactMessages"

type ContactMessagesProps = {
    contactMessagesQuery: UseInfiniteQueryResult<GetContactMessagesResponse, unknown>;
}

const ContactMessages = (props: React.PropsWithoutRef<ContactMessagesProps>) => {
    const messagesSectionRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (messagesSectionRef.current && props.contactMessagesQuery.isFetched) {
            messagesSectionRef.current.scrollTo({
                behavior: "instant",
                top: messagesSectionRef.current.scrollHeight
            });
        }
    }, [props.contactMessagesQuery.isFetched]);

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