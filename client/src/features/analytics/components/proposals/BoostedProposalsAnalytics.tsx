import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProposalsAnalyticsBoosters } from "../../services/proposalsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type BoostedProposalsAnalytics = {
    title: string;
    proposals: ProposalsAnalyticsBoosters[] | undefined;
    isLoading: boolean;
}

const BoostedProposalsAnalytics = (props: React.PropsWithoutRef<BoostedProposalsAnalytics>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const proposalsAnalytics = props.isLoading
        ? []
        : props.proposals!.map((value, index) => {
            const color = pieChartColors[index + 1];

            extraAnalytics.push({
                ...value,
                _id: value._id ? "boosted" : "unboosted",
                percentage: Number(value.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: value._id ? "boosted" : "unboosted",
                value: value.count,
                color: color.hex || "#eee"
            }
        });


    const data = proposalsAnalytics.length
        ? proposalsAnalytics
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
                        {proposalsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default BoostedProposalsAnalytics