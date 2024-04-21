import { SingleJobType } from "../service/getSingleJob"
import SingleJobAboutClient from "./SingleJobAboutClient";
import SingleJobActivity from "./SingleJobActivity";
import SingleJobHeader from "./SingleJobHeader";
import SingleJobMainContent from "./SingleJobMainContent";
import SingleJobSkills from "./SingleJobSkills";

type SingleJobContainerProps = {
    jobDetails: SingleJobType;
}

const SingleJobContainer = (props: React.PropsWithoutRef<SingleJobContainerProps>) => {
    return (
        <div className="grid grid-cols-1 gap-10">
            <div className="flex flex-col gap-6">
                <SingleJobHeader status={props.jobDetails.status} title={props.jobDetails.title} category={props.jobDetails.category} createdAt={props.jobDetails.createdAt} jobId={props.jobDetails._id} />
                <SingleJobMainContent jobMainDetails={{
                    description: props.jobDetails.description,
                    connects: props.jobDetails.connects,
                    duration: props.jobDetails.duration,
                    experienceLevel: props.jobDetails.experienceLevel,
                    locationType: props.jobDetails.locationType,
                    price: props.jobDetails.price,
                    priceType: props.jobDetails.priceType,
                    weeklyHours: props.jobDetails.weeklyHours
                }} />
                <SingleJobSkills tags={props.jobDetails.tags} />
                <SingleJobActivity jobActivity={props.jobDetails.activity} />
            </div>
            <aside className="flex flex-col gap-6">
                <SingleJobAboutClient jobStatus={props.jobDetails.status} clientInfo={props.jobDetails.profile} connects={props.jobDetails.connects} jobId={props.jobDetails._id} hasSubmitted={props.jobDetails.hasSubmitted} />
            </aside>
        </div>
    )
}

export default SingleJobContainer