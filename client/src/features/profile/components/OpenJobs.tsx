import JobItem from "../../../components/home/JobItem";
import { OpenJob } from "./SingleProfileEmployer";

interface Props {
    jobs: OpenJob[];
}

const OpenJobs = (props: React.PropsWithoutRef<Props>) => {
    const jobs = props.jobs.map(job => {
        const jobInfo = {
            _id: job._id,
            employer: job.employer,
            title: job.title
        };

        const price = typeof job.price === "number" ? `$${job.price} / fixed` : `$${job.price.start} - $${job.price.end} / hour`;
        const tags = [
            price,
            job.category,
            job.jobType,
            job.location
        ]

        return <JobItem jobInfo={jobInfo} tags={tags} key={job._id} />
    });
    return (
        <article className='p-4'>
            <h2 className="font-medium text-2xl">Open Jobs</h2>
            <ul className='mt-4 grid gap-5'>
                {jobs}
            </ul>
        </article>
    )
}

export default OpenJobs