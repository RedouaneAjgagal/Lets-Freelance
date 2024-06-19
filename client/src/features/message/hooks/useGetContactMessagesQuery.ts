import { useInfiniteQuery } from '@tanstack/react-query';
import getContactMessages, { GetContactMessagesPayload } from '../services/getContactMessages';
import { useAppSelector } from '../../../hooks/redux';

const useGetContactMessagesQuery = (payload: GetContactMessagesPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const contactMessages = getContactMessages(payload);

    const getContactMessagesQuery = useInfiniteQuery({
        queryKey: ["contactMessages", userInfo!.userId, payload.userId],
        queryFn: contactMessages,
        enabled: false,
        keepPreviousData: true,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    return getContactMessagesQuery;
}

export default useGetContactMessagesQuery