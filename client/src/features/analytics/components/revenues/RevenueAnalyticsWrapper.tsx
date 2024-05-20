import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ServiceRevenueAnalyticsPaymentType } from "../../services/serviceRevenueAnalytics";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar";
import formatDates, { formatRequestDates } from "../../utils/formatDates";

type RevenueAnalyticsWrapperProps = {
    title: string;
    isLoading: boolean;
    payments: ServiceRevenueAnalyticsPaymentType[] | undefined;
    filterBy: FilterValues;
    barDataKey: string;
}

const RevenueAnalyticsWrapper = (props: React.PropsWithoutRef<RevenueAnalyticsWrapperProps>) => {
    const grossRevenueBarDataKey = "Gross revenue";
    const netRevenueBarDataKeyThree = "Net revenue";

    let revenueData = {
        mainRevenue: {
            title: props.barDataKey,
            value: 0
        },
        grossRevenue: {
            title: grossRevenueBarDataKey,
            value: 0
        },
        netRevenue: {
            title: netRevenueBarDataKeyThree,
            value: 0
        }
    };

    const revenueAnalytics = props.payments?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        revenueData = {
            mainRevenue: {
                ...revenueData.mainRevenue,
                value: revenueData.mainRevenue.value + value.count
            },
            grossRevenue: {
                ...revenueData.grossRevenue,
                value: revenueData.grossRevenue.value + value.grossRevenue
            },
            netRevenue: {
                ...revenueData.netRevenue,
                value: revenueData.netRevenue.value + value.netRevenue
            }
        };

        return {
            _id: dateValue,
            [props.barDataKey]: value.count || 0,
            [grossRevenueBarDataKey]: Number(value.grossRevenue.toFixed(2)) || 0,
            [netRevenueBarDataKeyThree]: Number(value.netRevenue.toFixed(2)) || 0
        }
    });

    const revenueAnalyticsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: revenueAnalytics || [],
        barDataKey: props.barDataKey
    });

    const data = Object.values(revenueData).map(data => {
        return {
            ...data,
            value: data.title === props.barDataKey ? data.value : `$${data.value.toFixed(2)}`
        }
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : revenueAnalyticsData}
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
                    <Bar dataKey={props.barDataKey} fill="#3b82f6" activeBar={
                        <Rectangle fill="#bae6fd" stroke="blue" />
                    } />
                    <Bar dataKey={grossRevenueBarDataKey} stackId="as" fill="#60a5fa" activeBar={
                        <Rectangle fill="#bae6fd" stroke="blue" />
                    } />
                    <Bar dataKey={netRevenueBarDataKeyThree} stackId="a" fill="#1d4ed8" activeBar={
                        <Rectangle fill="#bae6fd" stroke="blue" />
                    } />
                </BarChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default RevenueAnalyticsWrapper