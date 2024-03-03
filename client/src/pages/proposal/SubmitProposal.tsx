import Loading from "../../components/Loading";
import { useGetSingleJobQuery } from "../../features/job"
import { SubmitProposalContainer } from "../../features/proposal";

const SubmitProposal = () => {
    const getSingleJobQuery = useGetSingleJobQuery();

    if (getSingleJobQuery.isSuccess && getSingleJobQuery.data.status !== "open") {
        throw new Error("Unauthorized action, job is now closed");
    }

    return (
        getSingleJobQuery.isLoading ?
            <Loading />
            : <main className="p-4">
                <h1 className="font-semibold text-2xl text-slate-900">Submit a proposal</h1>
                <SubmitProposalContainer jobDetails={getSingleJobQuery.data!} />
            </main>
    )
}

export default SubmitProposal