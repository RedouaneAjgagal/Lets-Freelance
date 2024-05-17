import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProposalsAnalyticsPostedAtType } from "../../services/proposalsAnalytics";
import AnalyticsWrapper from "../AnalyticsWrapper";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import { FilterValues } from "../ChartsNavbar";

type CreatedProposalsAnalyticsProps = {
    isLoading: boolean;
    title: string;
    createdAtProposals: ProposalsAnalyticsPostedAtType[] | undefined;
    totalProposals: number | undefined;
    filterBy: FilterValues;
}

const CreatedProposalsAnalytics = (props: React.PropsWithoutRef<CreatedProposalsAnalyticsProps>) => {
    const barDataKey = "Created proposals";

    const data = [
        {
            title: "proposals of all time",
            value: props.totalProposals || 0
        }
    ];

    const createdProposalsAnalytics = props.createdAtProposals?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdProposalsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdProposalsAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdProposalsData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray={3} />
                    <XAxis dataKey="_id" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={barDataKey} fill="#4884d8" activeBar={<Rectangle fill="#bae6fd" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </AnalyticsWrapper>
    )
}

export default CreatedProposalsAnalytics