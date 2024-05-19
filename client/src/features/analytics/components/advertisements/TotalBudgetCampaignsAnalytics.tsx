import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CampaignAnalyticsResponse } from "../../services/campaignAnalytics";
import pieChartColors from "../../utils/pieChartColors";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";

type TotalBudgetCampaignsAnalyticsProps = {
    title: string;
    isLoading: boolean;
    campaigns: CampaignAnalyticsResponse["totalBudgetCampaigns"] | undefined;
}

const TotalBudgetCampaignsAnalytics = (props: React.PropsWithoutRef<TotalBudgetCampaignsAnalyticsProps>) => {
    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const campaignsAnalytics = props.isLoading
        ? []
        : props.campaigns!.map((value, index) => {
            const color = pieChartColors[index + 1];

            const name = {
                low: "$1.00 - $20.00",
                mid: "$20.00 - $100.00",
                high: "$100.00+"
            };

            extraAnalytics.push({
                ...value,
                _id: `${value._id} | ${name[value._id]}`,
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

export default TotalBudgetCampaignsAnalytics