import { useEffect, useState } from "react"
import { JobForm } from "../../features/job"
import { jobFormAction } from "../../features/job/redux/jobForm";
import { useAppDispatch } from "../../hooks/redux";

const CreateJob = () => {
    const [jobFormKey, setJobFormKey] = useState(0);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setJobFormKey(prev => prev + 1);

        dispatch(jobFormAction.setInitialValues());
    }, []);

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Job creation</h1>
            <JobForm key={jobFormKey} formType="create" />
        </main>
    )
}

export default CreateJob