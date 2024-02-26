import { JobForm } from "../../features/job"

const CreateJob = () => {
    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Job creation</h1>
            <JobForm formType="create" />
        </main>
    )
}

export default CreateJob