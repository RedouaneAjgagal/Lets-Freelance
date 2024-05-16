import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ServicesAnalyticsPostedAtType } from "../../services/servicesAnalytics";
import AnalyticsWrapper from "../AnalyticsWrapper"
import formatDates, { formatRequestDates } from "../../utils/formatDates";

type CreatedServicesAnalyticsProps = {
    isLoading: boolean;
    totalServices: number | undefined;
    createdServices: ServicesAnalyticsPostedAtType[] | undefined;
    filterBy: "day" | "week" | "month" | "year" | "all";
}

const CreatedServicesAnalytics = (props: React.PropsWithoutRef<CreatedServicesAnalyticsProps>) => {
    const barDataKey = "Created services";

    const data = [
        {
            title: "Services of all time",
            value: props.totalServices || 0
        }
    ];

    const createdServicesAnalytics = props.createdServices?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdServicesData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdServicesAnalytics || [],
        barDataKey
    });

    return (
        <div>
            <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={barDataKey} isLoading={props.isLoading}>
                <ResponsiveContainer>
                    <BarChart className="w-full"
                        width={300}
                        height={300}
                        data={props.isLoading ? [{}] : createdServicesData}
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
        </div>
    )
}

export default CreatedServicesAnalytics