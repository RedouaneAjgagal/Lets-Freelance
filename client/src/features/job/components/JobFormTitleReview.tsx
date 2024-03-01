import toUpperCase from "../../../utils/toUpperCase";
import JobFormReviewWrapper from "./JobFormReviewWrapper";

type JobFormTitleReviewProps = {
    formData: {
        title: string;
        category: "Select category" | "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
        experienceLevel: "entryLevel" | "intermediate" | "expert";
    };
    navigateToStep: (step: number) => void;
}

const JobFormTitleReview = (props: React.PropsWithoutRef<JobFormTitleReviewProps>) => {

    const category = toUpperCase({
        value: props.formData.category,
        everyWord: true
    });

    const experienceLevel = props.formData.experienceLevel === "entryLevel" ? "Entry Level" : toUpperCase({
        value: props.formData.experienceLevel
    });

    return (
        <JobFormReviewWrapper step={1} stepTitle="Title" navigateToStep={props.navigateToStep}>
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Title:</h2>
                <p className="text-slate-600">{props.formData.title}</p>
            </div>
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Category:</h2>
                <p className="text-slate-600">{category}</p>
            </div>
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Experience level:</h2>
                <p className="text-slate-600">{experienceLevel}</p>
            </div>
        </JobFormReviewWrapper>
    )
}

export default JobFormTitleReview