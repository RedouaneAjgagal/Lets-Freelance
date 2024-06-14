import { useInfiniteQuery } from '@tanstack/react-query';
import getMessages, { GetMessagesPayload } from '../services/getMessages';
import { useAppSelector } from '../../../hooks/redux';

const useGetMessagesQuery = (payload: GetMessagesPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const messages = getMessages(payload);

    const getMessagesQuery = useInfiniteQuery({
        queryKey: ["messages", userInfo!.userId],
        queryFn: messages,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
        getNextPageParam: (lastPage) => lastPage.nextPage
    });

    return getMessagesQuery;
}

export default useGetMessagesQuery