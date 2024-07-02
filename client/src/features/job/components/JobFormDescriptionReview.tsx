import { useState } from 'react';
import toUpperCase from '../../../utils/toUpperCase';
import JobFormDescriptionModal from '../modals/JobFormDescriptionModal';
import useOverflow from '../../../hooks/useOverflow';
import JobFormReviewWrapper from './JobFormReviewWrapper';

type JobFormDescriptionReviewProps = {
    formData: {
        description: string;
        locationType: "remote" | "onsite";
        tags: string[];
    };
    navigateToStep: (step: number) => void;
}

const JobFormDescriptionReview = (props: React.PropsWithoutRef<JobFormDescriptionReviewProps>) => {
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const openDescriptionModalHandler = () => {
        setIsDescriptionModalOpen(true);
    }

    const closeDescriptionModalHandler = () => {
        setIsDescriptionModalOpen(false);
    }

    const locationType = toUpperCase({
        value: props.formData.locationType
    });

    useOverflow(isDescriptionModalOpen);

    return (
        <JobFormReviewWrapper step={2} stepTitle="Description" navigateToStep={props.navigateToStep}>
            {isDescriptionModalOpen ?
                <JobFormDescriptionModal description={props.formData.description} onClose={closeDescriptionModalHandler} />
                : null
            }
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Description:</h2>
                <button onClick={openDescriptionModalHandler} type="button" className="underline text-slate-600">View</button>
            </div>
            <div className="flex gap-x-2 flex-wrap">
                <h2 className="font-medium">Location type:</h2>
                <p className="text-slate-600">{locationType}</p>
            </div>
            {props.formData.tags.length ?
                <div className="flex gap-2">
                    <h2 className="font-medium">Tags:</h2>
                    <div className="flex gap-1 flex-wrap">
                        {props.formData.tags.map((tag, index) => (
                            <span className="border border-slate-300 rounded-full py-1 px-2 text-sm font-medium text-slate-600" key={index}>{tag}</span>
                        ))}
                    </div>
                </div>
                : null
            }
        </JobFormReviewWrapper>
    )
}

export default JobFormDescriptionReview