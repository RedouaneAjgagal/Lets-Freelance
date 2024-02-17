import FavoriteHeartButton from "../../../components/FavoriteHeartButton";
import Tag from "../../../components/Tag";
import formatPostedTime from "../../../utils/formatPostedTime";
import { JobType } from "../service/getJobs";
import JobDetails from "./JobDetails";

type JobCardWithFavorite = {
    hideFavoriteButton?: false;
    isFavorite: boolean;
    onFavorite: (jobId: string) => void;
}

type JobCardWithoutFavorite = {
    hideFavoriteButton: true;
}

type JobCardProps = {
    job: JobType
} & (JobCardWithFavorite | JobCardWithoutFavorite);

const JobCard = (props: React.PropsWithoutRef<JobCardProps>) => {
    const jobDetail = {
        price: props.job.price,
        priceType: props.job.priceType,
        duration: props.job.duration,
        weeklyHours: props.job.weeklyHours,
        experienceLevel: props.job.experienceLevel,
    }

    const { diff, unit, pluralize } = formatPostedTime({
        postedAt: props.job.createdAt
    });

    const postedAt = `Posted ${diff} ${unit}${pluralize} ago`;

    const jobNavigator = () => {
        console.log({ job_id: props.job._id });
    }

    return (
        <div className="relative border-b pb-6 last:border-b-0 cursor-pointer p-4 pt-6 flex flex-col gap-8" role="link" onClick={jobNavigator}>
            {!props.hideFavoriteButton ?
                <FavoriteHeartButton fillHeart={props.isFavorite} onClick={() => props.onFavorite(props.job._id)} />
                : null
            }
            <article className="flex flex-col gap-2">
                <div>
                    <span className="text-slate-500 text-[.8rem]">{postedAt}</span>
                    <h2 className="text-xl font-semibold">{props.job.title}</h2>
                </div>
                <div className="flex flex-col gap-5">
                    <JobDetails jobDetail={jobDetail} />
                    <p className="line-clamp-4">{props.job.description}</p>
                    <div className="flex gap-2 flex-wrap">
                        {props.job.tags.map((tag, index) => <Tag clickable={false} key={index} value={tag} />)}
                    </div>
                </div>
            </article>
        </div>
    )
}

export default JobCard