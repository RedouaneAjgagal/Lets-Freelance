import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCardContainer from "./DashboardCardContainer";

type EmployerDashboardProposalProps = {
    proposalDetails: EmployerReportsType["proposal"];
}

const EmployerDashboardProposal = (props: React.PropsWithoutRef<EmployerDashboardProposalProps>) => {
    const proposalsDetails = [
        {
            title: "Pending Proposals",
            value: props.proposalDetails.pendingProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2516/2516759.png"
        },
        {
            title: "In Interview Proposals",
            value: props.proposalDetails.interviewingProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Hired Proposals",
            value: props.proposalDetails.hiredProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        },
        {
            title: "Rejected Proposals",
            value: props.proposalDetails.rejectedProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2623/2623031.png"
        }
    ];

    return (
        <DashboardCardContainer cardsDetails={proposalsDetails} sectionTitle="Proposals" />
    )
}

export default EmployerDashboardProposal