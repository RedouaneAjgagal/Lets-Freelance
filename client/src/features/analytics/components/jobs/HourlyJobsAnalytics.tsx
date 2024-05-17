import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { JobAnalyticsHourlyPriceJobType } from "../../services/jobsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type HourlyJobsAnalyticsProps = {
    isLoading: boolean;
    hourlyJobs: JobAnalyticsHourlyPriceJobType[] | undefined;
    title: string;
    totalHourlyJobs: number | undefined;
}

const HourlyJobsAnalytics = (props: React.PropsWithoutRef<HourlyJobsAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const hourlyJobsAnalytics = props.isLoading
        ? []
        : props.hourlyJobs!.map((value, index) => {
            const color = pieChartColors[index + 1];

            const values = {
                low: "$1.00 - $10.00 /hr",
                mid: "$10.00 - $50.00 /hr",
                high: "$50+ /hr"
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

    const data = hourlyJobsAnalytics.length
        ? hourlyJobsAnalytics
        : [{ name: "Empty", color: "#eee", value: 1 }];

    return (
        <AnalyticsWrapper data={[{ title: "Total hourly jobs", value: props.totalHourlyJobs || 0 }]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={props.isLoading}>
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
                        {hourlyJobsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default HourlyJobsAnalytics