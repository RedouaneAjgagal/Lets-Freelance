import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobsAnalyticsPostedAtType } from "../../services/jobsAnalytics";
import AnalyticsWrapper from "../AnalyticsWrapper";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import { FilterValues } from "../ChartsNavbar";

type CreatedJobsAnalyticsProps = {
    totalJobs: number | undefined;
    createdJobs: JobsAnalyticsPostedAtType[] | undefined;
    title: string;
    isLoading: boolean;
    filterBy: FilterValues;
}

const CreatedJobsAnalytics = (props: React.PropsWithoutRef<CreatedJobsAnalyticsProps>) => {
    const barDataKey = "Created jobs";

    const data = [
        {
            title: "Jobs of all time",
            value: props.totalJobs || 0
        }
    ];

    const createdJobsAnalytics = props.createdJobs?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdJobsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdJobsAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdJobsData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray={3} />
                    <XAxis dataKey="_id" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={barDataKey} fill="#4884d8" activeBar={<Rectangle fill="#bae6fd" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default CreatedJobsAnalytics