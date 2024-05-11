import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper"
import useFreelancersAnalyticsQuery from "../../hooks/useFreelancersAnalyticsQuery";
import pieChartColors from "../../utils/pieChartColors";


const FreelancersAnalyticsContainer = () => {
    const freelancersAnalyticsQuery = useFreelancersAnalyticsQuery();

    const extraFreelancersAnalytics: ExtraAnalyticsDataType[] = [];

    const freelancersAnalytics = freelancersAnalyticsQuery.isLoading
        ? []
        : freelancersAnalyticsQuery.data!.badges.map((freelancer, index) => {
            const color = pieChartColors[index + 1];

            extraFreelancersAnalytics.push({
                ...freelancer,
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: freelancer._id,
                value: freelancer.count,
                color: color.hex || "#eee"
            }
        });

    const totalFreelancers = freelancersAnalyticsQuery.isLoading
        ? 0
        : freelancersAnalyticsQuery.data!.totalFreelancers.toLocaleString();

    const spendOnConnects = freelancersAnalyticsQuery.isLoading
        ? {
            _id: null,
            count: 0,
            percentage: 0
        }
        : freelancersAnalyticsQuery.data!.spendOnConnects;

    const freelancersData = [
        {
            title: "Total freelancers",
            value: totalFreelancers
        },
        {
            title: "Freelancers has spent on connects",
            value: `${spendOnConnects.percentage.toFixed(1)}%`
        }
    ];

    return (
        <div>
            <AnalyticsWrapper data={freelancersData} isFilter={false} title="Freelancers overview" bottomData={extraFreelancersAnalytics}>
                <ResponsiveContainer>
                    <PieChart >
                        <Pie
                            dataKey="value"
                            data={freelancersAnalytics}
                            cx={"50%"}
                            cy={"50%"}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={1}
                        >
                            {freelancersAnalytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </AnalyticsWrapper>
        </div>
    )
}

export default FreelancersAnalyticsContainer