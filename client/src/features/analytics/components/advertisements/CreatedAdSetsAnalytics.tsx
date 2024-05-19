import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdsAnalyticsResponse } from "../../services/adsAnalytics";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar";

type CreatedAdSetsAnalyticsProps = {
    title: string;
    isLoading: boolean;
    filterBy: FilterValues;
    ads: AdsAnalyticsResponse["durationAds"] | undefined;
    totalAds: AdsAnalyticsResponse["totalAds"] | undefined;
};

const CreatedAdSetsAnalytics = (props: React.PropsWithoutRef<CreatedAdSetsAnalyticsProps>) => {
    const barDataKey = "Created ad sets";

    const data = [
        {
            title: "Ad sets of all time",
            value: props.totalAds || 0
        }
    ];

    const createdAdSetsAnalytics = props.ads?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdAdSetsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdAdSetsAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdAdSetsData}
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

export default CreatedAdSetsAnalytics