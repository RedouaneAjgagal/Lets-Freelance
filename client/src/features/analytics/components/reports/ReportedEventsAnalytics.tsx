import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ReportsAnalyticsReportedEventsType } from "../../services/reportsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type ReportedEventsAnalyticsProps = {
    title: string;
    reportedEvents: ReportsAnalyticsReportedEventsType[] | undefined;
    totalReports: number | undefined;
    isLoading: boolean;
};

const ReportedEventsAnalytics = (props: React.PropsWithoutRef<ReportedEventsAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const reportEventsAnalytics = props.isLoading
        ? []
        : props.reportedEvents!.map((value, index) => {
            const color = pieChartColors[index + 1];

            extraAnalytics.push({
                ...value,
                _id: `${value._id}s`,
                percentage: Number(value.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: `${value._id}s`,
                value: value.count,
                color: color.hex || "#eee"
            }
        });


    const data = reportEventsAnalytics.length
        ? reportEventsAnalytics
        : [{ name: "Empty", color: "#eee", value: 1 }];


    return (
        <AnalyticsWrapper data={[{ title: "Total reports", value: props.totalReports || 0 }]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={props.isLoading}>
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
                        {reportEventsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default ReportedEventsAnalytics