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
        <div className="flex flex-col gap-6">
            <SingleJobHeader status={props.jobDetails.status} title={props.jobDetails.title} category={props.jobDetails.category} createdAt={props.jobDetails.createdAt} />
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
            <SingleJobAboutClient clientInfo={props.jobDetails.profile} />
        </div>
    )
}

export default SingleJobContainer