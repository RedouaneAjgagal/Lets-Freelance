import { InfiniteData } from "@tanstack/react-query";
import { MessagesResponse } from "../services/getMessages";
import SearchMessagesInput from "./SearchMessagesInput";
import React from "react";
import MessageItem from "./MessageItem";
import { TbLoader2 } from "react-icons/tb";
import FoundNoMessagesError from "./FoundNoMessagesError";

type MessagesContainerProps = {
  messages: InfiniteData<MessagesResponse>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  search: string;
  setUserIdHandler: (user: string) => void;
  selectedUserId: string;
}

const MessagesContainer = (props: React.PropsWithoutRef<MessagesContainerProps>) => {

  const fetchNextPage = () => {
    if (!props.hasNextPage || props.isFetchingNextPage) return;

    props.fetchNextPage();
  }

  return (
    <section className="bg-white border rounded col-span-1">
      <SearchMessagesInput />
      <ul className="py-3 max-h-[16rem] overflow-y-auto xl:max-h-[33rem]">
        {props.messages.pages.map((group, index) => (
          group.messages.length
            ? <React.Fragment key={index}>
              {group.messages.map(message => (
                <MessageItem key={message._id} messageContent={message} setUserIdHandler={props.setUserIdHandler} selectedUserId={props.selectedUserId} />
              ))}
            </React.Fragment>
            : <FoundNoMessagesError key={index} />
        ))}
        {props.hasNextPage
          ? <div className="p-4 w-full">
            <button disabled={props.isFetchingNextPage} onClick={fetchNextPage} className={`p-2 rounded font-medium w-full flex items-center justify-center border border-slate-300 ${props.isFetchingNextPage ? "bg-blue-100/60" : "bg-blue-100/30"}`}>
              {props.isFetchingNextPage
                ? <>
                  <span className="invisible flex">
                    Load more contacts
                  </span>
                  <TbLoader2 className="animate-spin absolute" size={20} />
                </>
                : "Load more messages"
              }
            </button>
          </div>
          : null
        }
      </ul>
    </section >
  )
}

export default MessagesContainer