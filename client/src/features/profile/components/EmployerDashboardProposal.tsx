import { EmployerReportsType } from "../services/getEmployerReports"
import DashboardCard from "./DashboardCard";

type EmployerDashboardProposalProps = {
    proposalDetails: EmployerReportsType["proposal"];
}

const EmployerDashboardProposal = (props: React.PropsWithoutRef<EmployerDashboardProposalProps>) => {
    const serviceDetails = [
        {
            title: "Pending Proposals",
            value: props.proposalDetails.pendingProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2516/2516759.png"
        },
        {
            title: "Hired Proposals",
            value: props.proposalDetails.hiredProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/10610/10610477.png"
        },
        {
            title: "In Interview Proposals",
            value: props.proposalDetails.interviewingProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/512/7154/7154465.png"
        },
        {
            title: "Rejected Proposals",
            value: props.proposalDetails.rejectedProposals,
            iconUrl: "https://cdn-icons-png.flaticon.com/128/2623/2623031.png"
        }
    ];

    return (
        <article className="flex flex-col gap-2">
            <h2 className="text-xl text-slate-800 font-semibold">Proposals</h2>
            <ul className="flex flex-col flex-wrap gap-4">
                {serviceDetails.map((service, index) => <DashboardCard cardTitle={service.title} value={service.value} iconUrl={service.iconUrl} key={index} />)}
            </ul>
        </article>
    )
}

export default EmployerDashboardProposal