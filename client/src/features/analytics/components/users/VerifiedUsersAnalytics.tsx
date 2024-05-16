import AnalyticsWrapper from '../AnalyticsWrapper'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FilterValues } from '../ChartsNavbar'
import { AccountsAnalyticsResponse } from '../../services/accountsAnalytics'
import formatDates, { formatRequestDates } from '../../utils/formatDates'

type VerifiedUsersAnalyticsProps = {
    filteBy: FilterValues;
    isLoading: boolean;
    verifiedUsers: AccountsAnalyticsResponse["verifiedAccounts"] | undefined;
    onFilter: ({ filterBy, key, loading }: {
        filterBy: FilterValues;
        key: "createdAccounts" | "verifiedAccounts";
        loading: "createdAccounts" | "verifiedAccounts";
    }) => void;
}

const VerifiedUsersAnalytics = (props: React.PropsWithoutRef<VerifiedUsersAnalyticsProps>) => {
    const barDataKey = "Verified accounts";

    const selectFilterValueHandler = (searchBy: FilterValues) => {
        props.onFilter({
            filterBy: searchBy,
            key: "verifiedAccounts",
            loading: "verifiedAccounts"
        });
    };

    const verifiedUsersAnalytics = props.verifiedUsers?.map(value => {
        const dateValue = formatRequestDates({
            value: value._id || 0,
            dateType: props.filteBy === "all" ? undefined : props.filteBy
        });

        return {
            _id: dateValue,
            [barDataKey]: value.count || 0
        }
    });

    const createdUsersData = formatDates({
        dateType: props.filteBy === "all" ? undefined : props.filteBy,
        value: verifiedUsersAnalytics || [],
        barDataKey
    });

    return (
        <AnalyticsWrapper key={barDataKey} filterValue={props.filteBy} onSelectFilter={selectFilterValueHandler} title={barDataKey} data={[]} isFilter bottomData={[]} isLoading={props.isLoading}>
            <ResponsiveContainer>
                <BarChart className="w-full"
                    width={300}
                    height={300}
                    data={props.isLoading ? [{}] : createdUsersData}
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

export default VerifiedUsersAnalytics