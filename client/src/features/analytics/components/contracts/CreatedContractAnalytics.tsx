import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ContractAnalyticsCreatedType } from "../../services/contractAnalytics";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar";

type CreatedContractAnalyticsProps = {
    totalContracts: number | undefined;
    createdContracts: ContractAnalyticsCreatedType[] | undefined;
    isLoading: boolean;
    title: string;
    filterBy: FilterValues;
};


const CreatedContractAnalytics = (props: React.PropsWithoutRef<CreatedContractAnalyticsProps>) => {
    const barDataKey = "Created contracts";

    const data = [
        {
            title: "Contracts of all time",
            value: props.totalContracts || 0
        }
    ];

    const createdContractsAnalytics = props.createdContracts?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filterBy === "all" ? undefined : props.filterBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdContractsData = formatDates({
        dateType: props.filterBy === "all" ? undefined : props.filterBy,
        value: createdContractsAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper data={data} isFilter={false} bottomData={[]} title={props.title} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdContractsData}
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

export default CreatedContractAnalytics