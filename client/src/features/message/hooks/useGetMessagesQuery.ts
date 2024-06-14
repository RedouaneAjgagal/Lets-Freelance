import { useInfiniteQuery } from '@tanstack/react-query';
import getMessages, { GetMessagesPayload } from '../services/getMessages';

const useGetMessagesQuery = (payload: GetMessagesPayload) => {
    const messages = getMessages(payload);

    const getMessagesQuery = useInfiniteQuery({
        queryKey: ["messages"],
        queryFn: messages,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
        getNextPageParam: (lastPage) => lastPage.nextPage
    });

    return getMessagesQuery;
}

export default useGetMessagesQuery