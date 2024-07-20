import JobItem from "../../../components/home/JobItem";
import { OpenJobType } from "../services/getSingleProfileInfo";

interface Props {
    profileDetails: {
        _id: string;
        name: string;
        country?: string;
    };
    jobs: OpenJobType[];
}

const OpenJobs = (props: React.PropsWithoutRef<Props>) => {
    const jobs = props.jobs.map(job => {
        const jobInfo = {
            _id: job._id,
            employer: props.profileDetails,
            title: job.title
        };

        const price = job.priceType === "fixed" ? `$${job.price.max} / fixed` : `$${job.price.min} - $${job.price.max} / hour`;
        const tags = [
            price,
            job.category,
            job.priceType,
            job.locationType
        ]

        return <JobItem jobInfo={jobInfo} tags={tags} key={job._id} />
    });
    
    return (
        <article className='p-4'>
            <h2 className="font-medium text-2xl">Open Jobs</h2>
            {
                props.jobs.length ?
                    <ul className='mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                        {jobs}
                    </ul>
                    :
                    <p className="mt-4 text-slate-500">Empty..</p>
            }
        </article>
    )
}

export default OpenJobs