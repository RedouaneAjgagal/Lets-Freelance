import { getRequest } from "../../../services/api";

type JobReportType = {
    postedJobs: number;
    inProgressJobs: number;
    completedJobs: number;
};

type ServiceReportType = {
    boughtServices: number;
    inProgressServices: number;
    completedServices: number;
};

type ProposalReportType = {
    pendingProposals: number;
    hiredProposals: number;
    interviewingProposals: number;
    rejectedProposals: number;
}

type TotalSpentType = {
    spentOnJobs: number;
    spentOnServices: number;
    refunded: number;
}

export type EmployerReportsType = {
    _id: string;
    profile: {
        name: string;
        avatar: string;
        rating: {
            avgRate: number | undefined;
            numOfReviews: number;
        };
    };
    job: JobReportType;
    service: ServiceReportType;
    proposal: ProposalReportType;
    totalSpent: TotalSpentType;
}


const getEmployerReports = async () => {
    const response = await getRequest("profiles/employers/reports");
    const employerReports = await response.data as EmployerReportsType;
    return employerReports;
}

export default getEmployerReports;