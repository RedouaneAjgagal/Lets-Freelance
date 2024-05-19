import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CampaignAnalyticsResponse } from "../../services/campaignAnalytics";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar";

type CreatedCampaignsAnalyticsProps = {
    title: string;
    isLoading: boolean;
    filterBy: FilterValues;
    campaigns: CampaignAnalyticsResponse["durationCampaigns"] | undefined;
    totalCampaigns: CampaignAnalyticsResponse["totalCampaigns"] | undefined;
};

const CreatedCampaignsAnalytics = (props: React.PropsWithoutRef<CreatedCampaignsAnalyticsProps>) => {
    const barDataKey = "Created campaigns";

    const data = [
        {
            title: "Campaigns of all time",
            value: props.totalCampaigns || 0
        }
    ];

    const createdCampaignsAnalytics = props.campaigns?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdCampaignsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdCampaignsAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdCampaignsData}
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

export default CreatedCampaignsAnalytics