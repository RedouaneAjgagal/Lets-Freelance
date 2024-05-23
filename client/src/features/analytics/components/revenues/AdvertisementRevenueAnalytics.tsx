import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AnalyticsWrapper from "../AnalyticsWrapper";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import { FilterValues } from "../ChartsNavbar";
import { AdvertisementRevenueAnalyticsPaymentType } from "../../services/advertisementRevenueAnalytics";

type AdvertisementRevenueAnalyticsProps = {
    filterBy: FilterValues;
    title: string;
    payments: AdvertisementRevenueAnalyticsPaymentType[] | undefined;
    isLoading: boolean;
    barDataKey: string;
};

const AdvertisementRevenueAnalytics = (props: React.PropsWithoutRef<AdvertisementRevenueAnalyticsProps>) => {
    let totalAmount: number = 0;

    const revenueAnalytics = props.payments?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        totalAmount += value.amount;

        return {
            _id: dateValue,
            [props.barDataKey]: value.amount || 0
        }
    });

    const revenueAnalyticsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: revenueAnalytics || [],
        barDataKey: props.barDataKey
    });

    const data = [
        {
            title: props.barDataKey,
            value: `$${totalAmount.toFixed(2)}`
        }
    ];

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
                    <Bar dataKey={props.barDataKey} stackId="as" fill="#60a5fa" activeBar={
                        <Rectangle fill="#bae6fd" stroke="blue" />
                    } />
                </BarChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )

}

export default AdvertisementRevenueAnalytics