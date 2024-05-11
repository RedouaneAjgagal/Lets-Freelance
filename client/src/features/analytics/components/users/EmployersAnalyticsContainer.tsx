import useEmployersAnalyticsQuery from "../../hooks/useEmployersAnalyticsQuery";
import AnalyticsWrapper from "../AnalyticsWrapper"

const EmployersAnalyticsContainer = () => {
    const employersAnalyticsQuery = useEmployersAnalyticsQuery();

    const totalEmployers = employersAnalyticsQuery.isLoading
        ? 0
        : employersAnalyticsQuery.data!.totalEmployers;

    const spendOnServices = employersAnalyticsQuery.isLoading
        ? 0
        : employersAnalyticsQuery.data!.spendOnServices.percentage;


    const data = [
        {
            title: "Total employers",
            value: totalEmployers
        },
        {
            title: "Employers has spent on services",
            value: `${spendOnServices.toLocaleString()}%`
        }
    ];

    return (
        <div>
            <AnalyticsWrapper title="Employers overview" isFilter={false} data={data} bottomData={[]} />
        </div>
    )
}

export default EmployersAnalyticsContainer