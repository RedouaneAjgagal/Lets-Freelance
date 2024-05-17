import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper"
import { JobsAnalyticsJobTypes } from "../../services/jobsAnalytics";
import pieChartColors from "../../utils/pieChartColors";

type JobTypesAnalyticsProps = {
    title: string;
    jobTypes: JobsAnalyticsJobTypes[] | undefined;
    isLoading: boolean;
    totalJobs: number | undefined;
}

const JobTypesAnalytics = (props: React.PropsWithoutRef<JobTypesAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const jobTypesAnalytics = props.isLoading
        ? []
        : props.jobTypes!.map((value, index) => {
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


    const data = jobTypesAnalytics.length
        ? jobTypesAnalytics
        : [{ name: "Empty", color: "#eee", value: 1 }];


    return (
        <AnalyticsWrapper data={[{ title: "Total jobs", value: props.totalJobs || 0 }]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={props.isLoading}>
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
                        {jobTypesAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default JobTypesAnalytics