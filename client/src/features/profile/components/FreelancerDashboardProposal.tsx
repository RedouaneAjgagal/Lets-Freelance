import React from 'react'
import { FreelnacerReportsType } from '../services/getFreelancerReports';
import DashboardCardContainer from './DashboardCardContainer';

type FreelancerDashboardProposalProps = {
    proposalDetails: FreelnacerReportsType["proposal"];
}

const FreelancerDashboardProposal = (props: React.PropsWithoutRef<FreelancerDashboardProposalProps>) => {

    const proposalDetails = [
        {
            title: "In Interview Proposals",
            value: props.proposalDetails.interviewingProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2516/2516759.png"
        },
        {
            title: "Approved Proposals",
            value: props.proposalDetails.approvedProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        },
        {
            title: "Rejected Proposals",
            value: props.proposalDetails.rejectedProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2623/2623031.png"
        }
    ];


    return (
        <DashboardCardContainer cardsDetails={proposalDetails} sectionTitle="Proposals" />
    )
}

export default FreelancerDashboardProposal