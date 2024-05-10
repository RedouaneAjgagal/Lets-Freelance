import { TbLoader3 } from "react-icons/tb";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { FilterValues } from "../ChartsNavbar"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AccountsAnalyticsResponse } from "../../services/accountsAnalytics";
import formatDates, { formatRequestDates } from "../../utils/formatDates";

export type FilterAccountsType = {
    filterBy: FilterValues;
    key: "createdAccounts" | "verifiedAccounts";
    loading: "createdAccounts" | "verifiedAccounts"
};

type CreatedUsersAnalyticsProps = {
    filteBy: FilterValues;
    isLoading: boolean;
    createdUsers: AccountsAnalyticsResponse["createdAccounts"] | undefined;
    onFilter: ({ filterBy, key, loading }: FilterAccountsType) => void;
    totalAccounts: number | undefined;
};

const CreatedUsersAnalytics = (props: React.PropsWithoutRef<CreatedUsersAnalyticsProps>) => {
    const barDataKey = "Created accounts";

    const selectFilterValueHandler = (searchBy: FilterValues) => {
        props.onFilter({
            filterBy: searchBy,
            key: "createdAccounts",
            loading: "createdAccounts"
        });
    }

    const createdUserAnalytics = props.createdUsers?.map(value => {
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
        value: createdUserAnalytics || [],
        barDataKey
    });

    const navData = [
        {
            title: "Accounts of all time",
            value: props.totalAccounts || 0
        }
    ];

    return (
        <AnalyticsWrapper key={barDataKey} filterValue={props.filteBy} onSelectFilter={selectFilterValueHandler} title={barDataKey} data={navData}>
            {props.isLoading ?
                <div className=" bg-slate-900/80 absolute  flex items-center justify-center w-full top-0 left-0 h-full z-20">
                    <TbLoader3 className="animate-spin text-white" size={55} />
                </div>
                : null
            }
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

export default CreatedUsersAnalytics