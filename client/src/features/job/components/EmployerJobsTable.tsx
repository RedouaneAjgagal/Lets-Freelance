import TableHead from "../../../components/TableHead";
import { EmployerJobType } from "../service/getEmployerJobs"
import EmployerJobTable from "./EmployerJobTable";

type EmployerJobsTableProps = {
    jobs: EmployerJobType[];
}

const EmployerJobsTable = (props: React.PropsWithoutRef<EmployerJobsTableProps>) => {

    const tableHeads = ["Title", "Price", "Status", "Actions"];

    return (
        <section className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2">
            <table className="text-left w-full">
                <TableHead tableHeads={tableHeads} />
                <tbody>
                    {props.jobs.map(job => <EmployerJobTable key={job._id} job={job} />)}
                </tbody>
            </table>
        </section>
    )
}

export default EmployerJobsTable