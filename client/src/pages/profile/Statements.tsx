import Loading from "../../components/Loading";
import { useProfileStatementsQuery, StatementsCards, StatementsPayments } from "../../features/profile";

const Statements = () => {
    const profileStatements = useProfileStatementsQuery();

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Statements</h1>
            {
                profileStatements.isLoading ?
                    <Loading type="table" />
                    :
                    <>
                        <StatementsCards cardsDetails={{
                            oneMonthPayments: profileStatements.data!.oneMonthPayments,
                            oneYearPayments: profileStatements.data!.oneYearPayments,
                            pendingPayments: profileStatements.data!.pendingPayments,
                            total: profileStatements.data!.total
                        }} />
                        <StatementsPayments payments={profileStatements.data!.payments} />
                    </>
            }
        </main>
    )
}

export default Statements;