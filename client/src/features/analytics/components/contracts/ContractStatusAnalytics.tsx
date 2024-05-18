import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ContractAnalyticsStatusTypes } from "../../services/contractAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type ContractStatusAnalyticsProps = {
    title: string;
    isLoading: boolean;
    contracts: ContractAnalyticsStatusTypes[] | undefined;
}

const ContractStatusAnalytics = (props: React.PropsWithoutRef<ContractStatusAnalyticsProps>) => {
    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const contractsAnalytics = props.isLoading
        ? []
        : props.contracts!.map((value, index) => {
            const color = pieChartColors[index + 1];

            extraAnalytics.push({
                ...value,
                _id: value._id === "inProgress" ? "in progress" : value._id,
                percentage: Number(value.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: value._id === "inProgress" ? "in progress" : value._id,
                value: value.count,
                color: color.hex || "#eee"
            }
        });


    const data = contractsAnalytics.length
        ? contractsAnalytics
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
                        {contractsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default ContractStatusAnalytics