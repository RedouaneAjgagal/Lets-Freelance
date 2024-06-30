import Loading from "../../components/Loading";
import { useEmployerJobsQuery, EmployerJobsContainer } from "../../features/job"

const EmployerJobs = () => {

    const employerJobs = useEmployerJobsQuery();

    return (
        <main className="p-4 flex flex-col gap-6 bg-purple-100/30">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">My Jobs</h1>
            {employerJobs.isLoading ?
                <Loading type="table" />
                :
                <EmployerJobsContainer jobs={employerJobs.data!} />
            }
        </main>
    )
}

export default EmployerJobs