import { useEffect, useState } from "react";
import { PrimaryButton } from "../../../layouts/brand";
import JobFormStepFour from "./JobFormStepFour";
import JobFormStepOne from "./JobFormStepOne";
import JobFormStepThree from "./JobFormStepThree";
import JobFormStepTwo from "./JobFormStepTwo";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { jobFormAction } from "../redux/jobForm";
import JobFormReview from "./JobFormReview";

type JobFormProps = {
    formType: "create" | "update";
}

const JobForm = (props: React.PropsWithoutRef<JobFormProps>) => {
    const [isFormTouch, setIsFormTouch] = useState<boolean | "">("");

    const [isReviewMode, setIsReviewMode] = useState(false);

    const jobFormReducer = useAppSelector(state => state.jobFormReducer);
    const dispatch = useAppDispatch();

    const [currentStep, setCurrentStep] = useState<number>(1);

    const createJobHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const stepsData = {
            1: {
                title: form.get("job_title")?.toString(),
                category: form.get("job_category")?.toString(),
                experienceLevel: form.get("job_experienceLevel")?.toString()
            },
            2: {
                description: form.get("job_description")?.toString(),
                plainDescription: form.get("job_plainDescription")?.toString(),
                locationType: form.get("job_locationType")?.toString(),
                tags: form.get("job_tag")?.toString() === "" ? [] : form.get("job_tag")?.toString().split("***"),
            },
            3: {
                priceType: form.get("job_priceType")?.toString(),
                price: {
                    min: form.get(form.get("job_priceType")?.toString() === "hourly" ? "job_price_min" : "job_price_budget")?.toString(),
                    max: form.get(form.get("job_priceType")?.toString() === "hourly" ? "job_price_max" : "job_price_budget")?.toString(),
                },
            },
            4: {
                weeklyHours: {
                    min: form.get("job_weeklyHours_min")?.toString(),
                    max: form.get("job_weeklyHours_max")?.toString(),
                },
                duration: {
                    dateType: form.get("job_duration_type")?.toString(),
                    dateValue: form.get("job_duration_value")?.toString(),
                }
            }
        };

        switch (currentStep) {
            case 1:
                const stepOneInputs = stepsData[1];
                dispatch(jobFormAction.setStepOneData(stepOneInputs));
                break;

            case 2:
                const stepTwoInputs = stepsData[2];
                dispatch(jobFormAction.setStepTwoData(stepTwoInputs));
                break;

            case 3:
                const stepThreeInputs = stepsData[3];
                dispatch(jobFormAction.setStepThreeData(stepThreeInputs));
                break;

            case 4:
                const stepFourInputs = stepsData[4];
                dispatch(jobFormAction.setStepFourData(stepFourInputs));
                break;

            default:
                break;
        }

        setIsFormTouch(prev => !prev);
    }

    useEffect(() => {
        if (isFormTouch === "") return;

        const stepOneData = {
            title: jobFormReducer.title,
            category: jobFormReducer.category,
            experienceLevel: jobFormReducer.experienceLevel
        };

        const stepTwoData = {
            description: jobFormReducer.description,
            locationType: jobFormReducer.locationType,
            tags: jobFormReducer.tags
        };

        const stepThreeData = {
            priceType: jobFormReducer.priceType,
            price: jobFormReducer.price,
        }

        const stepFourData = {
            weeklyHours: jobFormReducer.weeklyHours,
            duration: jobFormReducer.duration
        }

        const jobFormStepsData: { [key: number]: { [key: string]: { value: string | [] | {}; error: { isError: boolean; message: string } } } } = {
            1: stepOneData,
            2: stepTwoData,
            3: stepThreeData,
            4: stepFourData
        };

        const currentStepData = jobFormStepsData[currentStep];
        const hasErrors = Object.values(currentStepData).filter((value) => (value.error.isError));

        if (hasErrors.length) {
            toast.error(hasErrors[0].error.message, {
                id: `formJob_step_${currentStep}`
            });
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsReviewMode(true);
        }
    }, [isFormTouch]);

    const steps: { [key: number]: JSX.Element } = {
        1: <JobFormStepOne />,
        2: <JobFormStepTwo />,
        3: <JobFormStepThree />,
        4: <JobFormStepFour />
    }

    const getPrevStepHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentStep === 1) return;

        if (isReviewMode) {
            setCurrentStep(4);
            setIsReviewMode(false);
            return;
        }

        setCurrentStep(prev => prev - 1);
    }

    const stepContents: { [key: number]: string } = {
        1: "Title",
        2: "Description",
        3: "Budget",
        4: "Work time"
    }

    const submitFormButtonContent = props.formType === "create" ? "Create Job Post" : "Update Job Post";

    const isSubmit = currentStep === 4;
    const primaryButtonContent = isReviewMode ? submitFormButtonContent
        : isSubmit ? "Review Job Post"
            : `Next: ${stepContents[currentStep + 1]}`;


    const changeStepHandler = (step: number) => {
        setCurrentStep(step);
        setIsReviewMode(false);
    }

    return (
        <form onSubmit={createJobHandler} className="flex flex-col gap-6">
            {!isReviewMode ?
                <div className="flex items-center gap-2 mb-2">
                    <small>{currentStep} / 4</small>
                    <span className="text-slate-600">{stepContents[currentStep]}</span>
                </div>
                : null}
            {isReviewMode ?
                <JobFormReview onChangeStep={changeStepHandler} />
                : steps[currentStep]
            }
            <div className="flex justify-end gap-4">
                {currentStep > 1 ?
                    <button type="button" onClick={getPrevStepHandler} className="border rounded border-purple-600 px-2 font-medium text-purple-600">Back</button>
                    : null
                }
                <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">{primaryButtonContent}</PrimaryButton>
            </div>
        </form>
    )
}

export default JobForm