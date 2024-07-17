import { useParams, useSearchParams } from "react-router-dom"
import useMarkAsPaidProposalQuery from "../../features/proposal/hooks/useMarkAsPaidProposalQuery";
import Loading from "../../components/Loading";
import { MarkAsPaidProposal } from "../../features/proposal";
import { AxiosError } from "axios";


const SetPaidFixedPriceProposal = () => {
    const { proposalId } = useParams();
    const [URLSearchParams] = useSearchParams();

    const jobId = URLSearchParams.get("job_id");

    const session_id = URLSearchParams.get("session_id");

    const backTo = jobId ? `/profile/employer/proposals/job/${jobId}`
        : "/profile/employer/jobs";

    if (!session_id) {
        return (
            <main className="p-4">
                <MarkAsPaidProposal message="Something went wrong" status="error" backTo="/profile/employer/jobs" />
            </main>
        )
    };

    const markAsPaidProposalQuery = useMarkAsPaidProposalQuery({
        proposalId: proposalId!,
        session_id
    });

    return (
        <main className="p-4">
            {markAsPaidProposalQuery.isLoading ?
                <div className="flex flex-col items-center gap-3 py-10">
                    <h3 className="font-medium text-xl text-slate-600">Verifying..</h3>
                    <Loading withoutBackground />
                </div>
                : markAsPaidProposalQuery.isSuccess ?
                    <MarkAsPaidProposal message={markAsPaidProposalQuery.data.msg} status="success" backTo={backTo} />
                    : <MarkAsPaidProposal message={(markAsPaidProposalQuery.error as AxiosError<{ msg: string }>).response?.data.msg || "Something went wrong"} status="error" backTo={backTo} />
            }
        </main>
    )
}

export default SetPaidFixedPriceProposal