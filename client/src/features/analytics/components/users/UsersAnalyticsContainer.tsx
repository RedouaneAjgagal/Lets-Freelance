import { FilterValues } from "../ChartsNavbar";
import { useEffect, useState } from "react";
import useAccountsAnalyticsQuery from "../../hooks/useAccountsAnalyticsQuery";
import CreatedUsersAnalytics, { FilterAccountsType } from "./CreatedUsersAnalytics";
import VerifiedUsersAnalytics from "./VerifiedUsersAnalytics";
import { AccountsAnalyticsPayload } from "../../services/accountsAnalytics";
import FreelancersAnalyticsContainer from "./FreelancersAnalyticsContainer";
import EmployersAnalyticsContainer from "./EmployersAnalyticsContainer";

type FiltersType = {
  createdAccounts: FilterValues;
  verifiedAccounts: FilterValues;
  loading?: "createdAccounts" | "verifiedAccounts";
};

const UsersAnalyticsContainer = () => {
  const [filters, setFilters] = useState<FiltersType>({
    createdAccounts: "week",
    verifiedAccounts: "week"
  });

  const accountsAnalyticsPayload: AccountsAnalyticsPayload = {};

  if (filters.createdAccounts !== "all") {
    accountsAnalyticsPayload.created_accounts_duration = filters.createdAccounts;
  }

  if (filters.verifiedAccounts !== "all") {
    accountsAnalyticsPayload.verified_accounts_duration = filters.verifiedAccounts;
  }

  const accountsAnalyticsQuery = useAccountsAnalyticsQuery(accountsAnalyticsPayload);

  const onFilterHandler = ({ filterBy, key, loading }: FilterAccountsType) => {
    setFilters(prev => {
      return { ...prev, [key]: filterBy, loading };
    });
  }

  useEffect(() => {
    accountsAnalyticsQuery.refetch();
  }, [filters.createdAccounts, filters.verifiedAccounts]);


  return (
    <div className="grid gap-6">
      <CreatedUsersAnalytics filteBy={filters.createdAccounts} isLoading={(accountsAnalyticsQuery.isLoading || accountsAnalyticsQuery.isFetching) && filters.loading === "createdAccounts"} createdUsers={accountsAnalyticsQuery.data?.createdAccounts} onFilter={onFilterHandler} totalAccounts={accountsAnalyticsQuery.data?.totalAccounts} />
      <VerifiedUsersAnalytics filteBy={filters.verifiedAccounts} isLoading={(accountsAnalyticsQuery.isLoading || accountsAnalyticsQuery.isFetching) && filters.loading === "verifiedAccounts"} onFilter={onFilterHandler} verifiedUsers={accountsAnalyticsQuery.data?.verifiedAccounts} />
      {accountsAnalyticsQuery.isLoading
        ? null
        : <>
          <FreelancersAnalyticsContainer />
          <EmployersAnalyticsContainer />
        </>
      }
    </div>
  )
}

export default UsersAnalyticsContainer