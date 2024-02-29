import { useState } from "react";
import { PrimaryButton } from "../../../layouts/brand";
import JobFormStepFour from "./JobFormStepFour";
import JobFormStepOne from "./JobFormStepOne";
import JobFormStepThree from "./JobFormStepThree";
import JobFormStepTwo from "./JobFormStepTwo";
import { createJobValidationStepFour, createJobValidationStepOne, createJobValidationStepThree, createJobValidationStepTwo } from "../validators/createJobValidation";
import toast from "react-hot-toast";

type JobFormProps = {
    formType: "create" | "update";
}

const JobForm = (props: React.PropsWithoutRef<JobFormProps>) => {

    const [stepOneErros, setStepOneErrors] = useState({
        title: false,
        category: false,
        experienceLevel: false
    });

    const initialStepTwoErrors = { description: false, locationType: false, tags: false };
    const [stepTwoErrors, setStepTwoErrors] = useState(initialStepTwoErrors);

    const initialStepThreeError = { priceType: false, price: false };
    const [stepThreeErrors, setStepThreeErrors] = useState(initialStepThreeError);

    const initialStepFourError = { weeklyHours: false, duration: false };
    const [stepFourErrors, setStepFourErrors] = useState(initialStepFourError);

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
                const invalidStepOne = createJobValidationStepOne(stepOneInputs);
                const stepOneHasError = Object.entries(invalidStepOne).filter(([_, value]) => {
                    if (value !== "") return true;
                });

                if (stepOneHasError.length) {
                    const errors = {
                        title: false,
                        category: false,
                        experienceLevel: false
                    };

                    stepOneHasError.forEach(value => {
                        const [key] = value;
                        errors[key as keyof typeof errors] = true;
                    });

                    setStepOneErrors(prev => {
                        return { ...prev, ...errors }
                    });

                    const [_, value] = stepOneHasError[0];
                    toast.error(value, {
                        id: "error_createJob_stepOne"
                    });

                    return;
                }

                setStepOneErrors({ title: false, category: false, experienceLevel: false });
                setCurrentStep(prev => prev + 1);
                break;

            case 2:
                const stepTwoInputs = stepsData[2];
                const invalidStepTwo = createJobValidationStepTwo(stepTwoInputs);

                const stepTwoHasError = Object.entries(invalidStepTwo).filter(([_, value]) => {
                    if (value !== "") return true;
                });

                if (stepTwoHasError.length) {
                    const errors = initialStepTwoErrors;

                    stepTwoHasError.forEach(value => {
                        const [key] = value;
                        errors[key as keyof typeof errors] = true;
                    });

                    setStepTwoErrors(prev => {
                        return { ...prev, ...errors }
                    });

                    const [_, value] = stepTwoHasError[0];
                    toast.error(value, {
                        id: "error_createJob_stepTwo"
                    });

                    return;
                }

                setStepTwoErrors(initialStepTwoErrors);
                setCurrentStep(prev => prev + 1);
                break;

            case 3:
                const stepThreeInputs = stepsData[3];
                const invalidStepThree = createJobValidationStepThree({
                    priceType: stepThreeInputs.priceType,
                    price: stepThreeInputs.price
                });

                const stepThreeHasError = Object.entries(invalidStepThree).filter(([_, value]) => {
                    if (value !== "") return true;
                });

                if (stepThreeHasError.length) {
                    const errors = initialStepThreeError;

                    stepThreeHasError.forEach(value => {
                        const [key] = value;
                        errors[key as keyof typeof errors] = true;
                    });

                    setStepThreeErrors(prev => {
                        return { ...prev, ...errors }
                    });

                    const [_, value] = stepThreeHasError[0];
                    toast.error(value, {
                        id: "error_createJob_stepThree"
                    });

                    return;
                }

                setStepThreeErrors(initialStepThreeError);
                setCurrentStep(prev => prev + 1);
                break;

            case 4:
                const stepFourInputs = stepsData[4];
                const invalidStepFour = createJobValidationStepFour({
                    weeklyHours: stepFourInputs.weeklyHours,
                    duration: stepFourInputs.duration
                });

                const stepFourHasError = Object.entries(invalidStepFour).filter(([_, value]) => {
                    if (value !== "") return true;
                });

                if (stepFourHasError.length) {
                    const errors = initialStepFourError;

                    stepFourHasError.forEach(value => {
                        const [key] = value;
                        errors[key as keyof typeof errors] = true;
                    });

                    setStepFourErrors(prev => {
                        return { ...prev, ...errors }
                    });

                    const [_, value] = stepFourHasError[0];
                    toast.error(value, {
                        id: "error_createJob_stepFour"
                    });

                    return;
                }

                setStepFourErrors(initialStepFourError);

                const createJobValues = Object.assign({}, ...Object.values(stepsData));
                delete createJobValues.plainDescription;
                console.log(createJobValues);

                break;
            default:
                break;
        }

    }

    const submitFormButtonContent = props.formType === "create" ? "Create job" : "Update";

    const isSubmit = currentStep === 4;
    const primaryButtonContent = isSubmit ? submitFormButtonContent : "Next";


    const steps: { [key: number]: JSX.Element } = {
        1: <JobFormStepOne errors={stepOneErros} />,
        2: <JobFormStepTwo errors={stepTwoErrors} />,
        3: <JobFormStepThree errors={stepThreeErrors} />,
        4: <JobFormStepFour errors={stepFourErrors} />
    }

    const getPrevStepHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentStep === 1) return;

        setCurrentStep(prev => prev - 1);
    }

    return (
        <form onSubmit={createJobHandler}>
            {steps[currentStep]}
            <div className="flex justify-end gap-2">
                <button type="button" onClick={getPrevStepHandler} className="border rounded border-slate-300 px-2">Back</button>
                <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">{primaryButtonContent}</PrimaryButton>
            </div>
        </form>
    )
}

export default JobForm