import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AnalyticsWrapper from "../AnalyticsWrapper";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import { FilterValues } from "../ChartsNavbar";
import { ConnectsRevenueAnalyticsResponse } from "../../services/connectsRevenueAnalytics";

type ConnectsRevenueAnalyticsProps = {
    filterBy: FilterValues;
    title: string;
    payments: ConnectsRevenueAnalyticsResponse | undefined;
    isLoading: boolean;
};

const ConnectsRevenueAnalytics = (props: React.PropsWithoutRef<ConnectsRevenueAnalyticsProps>) => {
    const mainBarDataKey = "Processed payments";
    const connectionsCountBarDataKey = "Amount of connects";
    const netRevenueBarDataKeyThree = "Net revenue";

    let revenueData = {
        mainRevenue: {
            title: mainBarDataKey,
            value: 0
        },
        connectionsCount: {
            title: connectionsCountBarDataKey,
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
                value: revenueData.mainRevenue.value + value.paymentsCount
            },
            connectionsCount: {
                ...revenueData.connectionsCount,
                value: revenueData.connectionsCount.value + value.connectionsCount
            },
            netRevenue: {
                ...revenueData.netRevenue,
                value: revenueData.netRevenue.value + value.netRevenue
            }
        };

        return {
            _id: dateValue,
            [mainBarDataKey]: value.paymentsCount || 0,
            [connectionsCountBarDataKey]: value.connectionsCount || 0,
            [netRevenueBarDataKeyThree]: Number(value.netRevenue.toFixed(2)) || 0
        }
    });

    const revenueAnalyticsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: revenueAnalytics || [],
        barDataKey: mainBarDataKey
    });

    const data = Object.values(revenueData).map(data => {

        return {
            ...data,
            value: data.title === netRevenueBarDataKeyThree
                ? `$${data.value.toFixed(2)}`
                : data.value
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
                    <Bar dataKey={mainBarDataKey} fill="#3b82f6" activeBar={
                        <Rectangle fill="#bae6fd" stroke="blue" />
                    } />
                    <Bar dataKey={connectionsCountBarDataKey} stackId="as" fill="#60a5fa" activeBar={
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

export default ConnectsRevenueAnalytics