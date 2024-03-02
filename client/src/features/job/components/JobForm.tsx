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
import useCreateJobMutation from "../hooks/useCreateJobMutation";
import { useNavigate, useParams } from 'react-router-dom';
import useUpdateJobMutation from "../hooks/useUpdateJobMutation";

type JobFormProps = {
    formType: "create" | "update";
}

const JobForm = (props: React.PropsWithoutRef<JobFormProps>) => {
    const createJobMutation = useCreateJobMutation();
    const updateJobMutation = useUpdateJobMutation();

    const { jobId } = useParams();

    const navigate = useNavigate();

    const [isFormTouch, setIsFormTouch] = useState<boolean | "">("");

    const [isReviewMode, setIsReviewMode] = useState(false);

    const jobFormReducer = useAppSelector(state => state.jobFormReducer);
    const dispatch = useAppDispatch();

    const [currentStep, setCurrentStep] = useState<number>(1);

    const jobHandlerAction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (createJobMutation.isLoading) return;

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
                    min: Number(form.get(form.get("job_priceType")?.toString() === "hourly" ? "job_price_min"
                        : "job_price_budget")?.toString()),
                    max: Number(form.get(form.get("job_priceType")?.toString() === "hourly" ? "job_price_max"
                        : "job_price_budget")?.toString())
                },
            },
            4: {
                weeklyHours: {
                    min: Number(form.get("job_weeklyHours_min")?.toString()),
                    max: Number(form.get("job_weeklyHours_max")?.toString())
                },
                duration: {
                    dateType: form.get("job_duration_type")?.toString(),
                    dateValue: Number(form.get("job_duration_value")?.toString())
                }
            }
        };

        if (isReviewMode) {
            const jobDataList = Object.entries(jobFormReducer).map(([key, value]) => {
                return { [key]: value.value }
            });

            const jobData = Object.assign({}, ...jobDataList);

            if (props.formType === "update") {
                updateJobMutation.mutate({
                    jobId: jobId!,
                    payload: jobData
                });
            } else {
                createJobMutation.mutate(jobData);
            }
            return;
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

        window.scrollTo({ top: 0, behavior: "instant" });
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

        window.scrollTo({ top: 0, behavior: "instant" });
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
        window.scrollTo({ top: 0, behavior: "instant" });
    }

    useEffect(() => {
        if (createJobMutation.isSuccess || updateJobMutation.isSuccess) {
            navigate("/profile/employer/jobs");
            dispatch(jobFormAction.setInitialValues());
        }
    }, [createJobMutation.isSuccess, updateJobMutation.isSuccess]);

    return (
        <form onSubmit={jobHandlerAction} className="flex flex-col gap-6" noValidate>
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
                <PrimaryButton isLoading={createJobMutation.isLoading || updateJobMutation.isLoading} disabled={createJobMutation.isLoading || updateJobMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">{primaryButtonContent}</PrimaryButton>
            </div>
        </form>
    )
}

export default JobForm