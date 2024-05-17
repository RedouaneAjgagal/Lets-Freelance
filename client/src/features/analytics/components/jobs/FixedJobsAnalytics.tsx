import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { JobAnalyticsFixedPriceJobType } from "../../services/jobsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type FixedJobsAnalyticsProps = {
    isLoading: boolean;
    fixedJobs: JobAnalyticsFixedPriceJobType[] | undefined;
    title: string;
    totalFixedJobs: number | undefined;
}

const FixedJobsAnalytics = (props: React.PropsWithoutRef<FixedJobsAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const fixedJobsAnalytics = props.isLoading
        ? []
        : props.fixedJobs!.map((value, index) => {
            const color = pieChartColors[index + 1];

            const values = {
                low: "$1.00 - $50.00",
                mid: "$50.00 - $500.00",
                high: "$500 - $1500.00",
                superHigh: "$1500+"
            };

            extraAnalytics.push({
                ...value,
                _id: `${value._id} | ${values[value._id]}`,
                percentage: Number(value.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });


            return {
                name: value._id,
                value: value.count,
                color: color.hex || "#eee"
            }
        });

    const data = fixedJobsAnalytics.length
        ? fixedJobsAnalytics
        : [{ name: "Empty", color: "#eee", value: 1 }];

    return (
        <AnalyticsWrapper data={[{ title: "Total fixed jobs", value: props.totalFixedJobs || 0 }]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={props.isLoading}>
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
                        {fixedJobsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default FixedJobsAnalytics