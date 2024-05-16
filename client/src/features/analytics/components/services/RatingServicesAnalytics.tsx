import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ServicesAnalyticsRatingType } from "../../services/servicesAnalytics"
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type RatingServicesAnalytics = {
    ratingServices: ServicesAnalyticsRatingType[] | undefined;
    title: string;
    isLoading: boolean;
}

const RatingServicesAnalytics = (props: React.PropsWithoutRef<RatingServicesAnalytics>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const ratingServicesAnalytics = props.isLoading
        ? []
        : props.ratingServices!.map((service, index) => {
            const color = pieChartColors[index + 1];

            const values = {
                none: "0",
                low: "1 - 3",
                mid: "3 - 4.5",
                high: "4.5+"
            }

            const name = service._id === "none"
                ? "no rating"
                : `${service._id} rating`;



            extraAnalytics.push({
                ...service,
                _id: `${name} | ${values[service._id]} starts`,
                percentage: Number(service.percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });


            return {
                name,
                value: service.count,
                color: color.hex || "#eee"
            }
        });


    return (
        <AnalyticsWrapper data={[]} isFilter={false} title={props.title} bottomData={extraAnalytics} isLoading={false}>
            <ResponsiveContainer>
                <PieChart >
                    <Pie
                        dataKey="value"
                        data={ratingServicesAnalytics}
                        cx={"50%"}
                        cy={"50%"}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={1}
                    >
                        {ratingServicesAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default RatingServicesAnalytics