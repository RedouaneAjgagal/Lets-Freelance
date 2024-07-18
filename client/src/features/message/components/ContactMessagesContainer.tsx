import useGetContactMessagesQuery from "../hooks/useGetContactMessagesQuery";
import SendMessageContainer from "./SendMessageContainer";
import ContactNavbar from "./ContactNavbar";
import ContactMessages from "./ContactMessages";
import { useEffect } from "react";
import { TbLoader2 } from "react-icons/tb";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/redux";
import { GetContactMessagesResponse } from "../services/getContactMessages";
import LoadingContactMessages from "./LoadingContactMessages";

type ContactMessagesContainerProps = {
    selectedUserId: string;
}

const ContactMessagesContainer = (props: React.PropsWithoutRef<ContactMessagesContainerProps>) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getContactMessagesQuery = useGetContactMessagesQuery({
        userId: props.selectedUserId
    });

    // to prevent duplicate refetch
    let isRefetch = false;
    useEffect(() => {
        if (isRefetch) return;
        isRefetch = true;
        if (!getContactMessagesQuery.isRefetching) {
            queryClient.setQueryData<InfiniteData<GetContactMessagesResponse>>(["contactMessages", userInfo!.userId, props.selectedUserId], (data) => {
                if (!data) return

                return {
                    pages: data.pages.slice(0, 1),
                    pageParams: data.pageParams.slice(0, 1)
                }
            });
        };

        if (getContactMessagesQuery.isFetching) return;
        getContactMessagesQuery.refetch({ refetchPage: (_, index) => index === 0 });
    }, [props.selectedUserId]);

    return (
        <div className="col-span-1 xl:col-span-2">
            {getContactMessagesQuery.isLoading
                ? <LoadingContactMessages />
                : <section className="bg-white border rounded relative">
                    {getContactMessagesQuery.isRefetching
                        ? <div className="flex items-center justify-center absolute rounded w-full h-full top-0 left-0 bg-slate-100/50 z-40">
                            <TbLoader2 className="animate-spin text-blue-500 relative" size={48} />
                        </div>
                        : null
                    }
                    <ContactNavbar contact={getContactMessagesQuery.data!.pages[getContactMessagesQuery.data!.pages.length - 1].contact} />
                    <ContactMessages contactMessagesQuery={getContactMessagesQuery} />
                    <SendMessageContainer contactId={getContactMessagesQuery.data!.pages[0].contact.user} />
                </section>
            }
        </div>
    )
}

export default ContactMessagesContainer