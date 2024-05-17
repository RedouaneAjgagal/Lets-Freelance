import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ReportsAnalyticsReportedAtType } from "../../services/reportsAnalytics";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar";
import formatDates, { formatRequestDates } from "../../utils/formatDates";

type CreatedReportsAnalyticsProps = {
    totalReports: number | undefined;
    reports: ReportsAnalyticsReportedAtType[] | undefined;
    isLoading: boolean;
    title: string;
    filterBy: FilterValues;
}

const CreatedReportsAnalytics = (props: React.PropsWithoutRef<CreatedReportsAnalyticsProps>) => {
    const barDataKey = "Created reports";

    const data = [
        {
            title: "Reports of all time",
            value: props.totalReports || 0
        }
    ];

    const createdJobsAnalytics = props.reports?.map(value => {
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

export default CreatedReportsAnalytics