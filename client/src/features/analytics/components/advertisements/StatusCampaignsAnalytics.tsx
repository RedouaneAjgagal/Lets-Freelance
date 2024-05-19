import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CampaignAnalyticsResponse } from "../../services/campaignAnalytics";
import pieChartColors from "../../utils/pieChartColors";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";

type StatusCampaignsAnalyticsProps = {
    isLoading: boolean;
    title: string;
    campaigns: CampaignAnalyticsResponse["statusCampaigns"] | undefined;
}

const StatusCampaignsAnalytics = (props: React.PropsWithoutRef<StatusCampaignsAnalyticsProps>) => {
    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const campaignsAnalytics = props.isLoading
        ? []
        : props.campaigns!.map((value, index) => {
            const color = pieChartColors[index + 1];

            extraAnalytics.push({
                ...value,
                percentage: Number(value.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: value._id,
                value: value.count,
                color: color.hex || "#eee"
            }
        });


    const data = campaignsAnalytics.length
        ? campaignsAnalytics
        : [{ name: "Empty", color: "#eee", value: 1 }];

    return (
        <AnalyticsWrapper data={[]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <PieChart >
                    <Pie
                        dataKey="value"
                        data={data}
                        cx={"50%"}
                        cy={"50%"}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={1}
                        fill="#e2e2e2"
                    >
                        {campaignsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default StatusCampaignsAnalytics