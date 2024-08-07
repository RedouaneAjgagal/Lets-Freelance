import Loading from "../../components/Loading";
import { useGetSingleJobQuery } from "../../features/job"
import { SubmitProposalContainer } from "../../features/proposal";

const SubmitProposal = () => {
    const getSingleJobQuery = useGetSingleJobQuery();

    if (getSingleJobQuery.isSuccess && (
        getSingleJobQuery.data.status !== "open"
        || getSingleJobQuery.data.hasSubmitted
    )) {
        throw new Error("Unauthorized action");
    }

    return (
        getSingleJobQuery.isLoading ?
            <Loading />
            : <main className="p-4 flex flex-col gap-4 bg-slate-50/70 xl:bg-white">
                <h1 className="font-semibold text-2xl text-slate-900">Submit a proposal</h1>
                <SubmitProposalContainer jobDetails={getSingleJobQuery.data!} />
            </main>
    )
}

export default SubmitProposal