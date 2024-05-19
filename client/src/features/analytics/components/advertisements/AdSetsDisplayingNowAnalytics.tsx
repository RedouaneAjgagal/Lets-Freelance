import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AdsAnalyticsResponse } from "../../services/adsAnalytics";
import AnalyticsWrapper, { ExtraAnalyticsDataType } from "../AnalyticsWrapper";
import pieChartColors from "../../utils/pieChartColors";

type AdSetsDisplayingNowAnalyticsProps = {
    title: string;
    isLoading: boolean;
    ads: AdsAnalyticsResponse["isDisplayingNow"] | undefined;
}

const AdSetsDisplayingNowAnalytics = (props: React.PropsWithoutRef<AdSetsDisplayingNowAnalyticsProps>) => {

    const extraAnalytics: ExtraAnalyticsDataType[] = [];

    const totalPercentage = props.isLoading
        ? 0
        : props.ads!.reduce((initialValue, value) => {
            return initialValue + value.count;
        }, 0);

    const adSetsAnalytics = props.isLoading
        ? []
        : props.ads!.map((value, index) => {
            const color = pieChartColors[index + 1];

            const percentage = (value.count / totalPercentage) * 100;

            extraAnalytics.push({
                ...value,
                _id: value._id ? "in display" : "not in display",
                percentage: Number(percentage.toFixed(2)),
                color: color.bgColor || "bg-blue-300"
            });

            return {
                name: value._id ? "in display" : "not in display",
                value: value.count,
                color: color.hex || "#eee"
            }
        });


    const data = adSetsAnalytics.length
        ? adSetsAnalytics
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
                        {adSetsAnalytics.map((entry, index) => (
                            <Cell key={`cell - ${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default AdSetsDisplayingNowAnalytics