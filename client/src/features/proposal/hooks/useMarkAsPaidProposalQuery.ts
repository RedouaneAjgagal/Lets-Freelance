import markAsPaidFixedPriceProposal, { MarkAsPaidFixedPriceProposalPayload } from '../service/markAsPaidFixedPriceProposal'
import { useQuery } from '@tanstack/react-query'

const useMarkAsPaidProposalQuery = (payload: MarkAsPaidFixedPriceProposalPayload) => {
    const markAsPaidProposalQuery = useQuery({
        queryKey: ["payFixedPriceProposal", payload.proposalId, payload.session_id],
        queryFn: () => markAsPaidFixedPriceProposal(payload),
        refetchOnWindowFocus: false
    });

    return markAsPaidProposalQuery;
}

export default useMarkAsPaidProposalQuery