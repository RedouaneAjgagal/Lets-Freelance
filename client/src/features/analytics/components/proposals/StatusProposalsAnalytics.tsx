import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProposalsAnalyticsStatusType } from "../../services/proposalsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type StatusProposalsAnalyticsProps = {
    title: string;
    statusProposals: ProposalsAnalyticsStatusType[] | undefined;
    isLoading: boolean;
}

const StatusProposalsAnalytics = (props: React.PropsWithoutRef<StatusProposalsAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const proposalsStatusAnalytics = props.isLoading
        ? []
        : props.statusProposals!.map((value, index) => {
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


    const data = proposalsStatusAnalytics.length
        ? proposalsStatusAnalytics
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
                        {proposalsStatusAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default StatusProposalsAnalytics