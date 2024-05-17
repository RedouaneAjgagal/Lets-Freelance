import { useQuery } from '@tanstack/react-query';
import React from 'react'
import reportsAnalytics, { ReportsAnalyticsPayload } from '../services/reportsAnalytics';

const useReportsAnalyticsQuery = (payload: ReportsAnalyticsPayload) => {
    const reportsAnalyticsQuery = useQuery({
        queryKey: ["reportsAnalytics"],
        queryFn: () => reportsAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return reportsAnalyticsQuery;
}

export default useReportsAnalyticsQuery