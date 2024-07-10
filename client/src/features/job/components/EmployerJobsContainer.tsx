import { EmployerJobType } from "../service/getEmployerJobs"
import EmployerJobsTable from "./EmployerJobsTable"

type EmployerJobsContainerProps = {
    jobs: EmployerJobType[]
}

const EmployerJobsContainer = (props: React.PropsWithoutRef<EmployerJobsContainerProps>) => {
    return (
        props.jobs.length ?
            <EmployerJobsTable jobs={props.jobs} />
            :
            <div className="flex flex-col gap-2 bg-white rounded p-4 shadow-sm">
                <h2 className="text-xl font-medium">Empty..</h2>
                <p className="text-slate-500">You haven't posted any job yet.</p>
            </div>
    )
}

export default EmployerJobsContainer