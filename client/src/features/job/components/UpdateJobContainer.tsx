import { useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { InitialJobFormStateType, jobFormAction } from "../redux/jobForm";
import { SingleJobType } from "../service/getSingleJob";
import JobForm from "./JobForm";

type UpdateJobContainerProps = {
    jobData: SingleJobType;
}

const UpdateJobContainer = (props: React.PropsWithoutRef<UpdateJobContainerProps>) => {
    const [isFormData, setIsFormData] = useState(false);

    const withoutError = { isError: false, message: "" };

    const formValues: InitialJobFormStateType = {
        title: {
            value: props.jobData.title,
            error: withoutError
        },
        category: {
            value: props.jobData.category,
            error: withoutError
        },
        description: {
            value: props.jobData.description,
            error: withoutError
        },
        duration: {
            value: props.jobData.duration,
            error: withoutError
        },
        experienceLevel: {
            value: props.jobData.experienceLevel,
            error: withoutError
        },
        locationType: {
            value: props.jobData.locationType,
            error: withoutError
        },
        price: {
            value: props.jobData.price,
            error: withoutError
        },
        priceType: {
            value: props.jobData.priceType,
            error: withoutError
        },
        tags: {
            value: props.jobData.tags,
            error: withoutError
        },
        weeklyHours: {
            value: props.jobData.weeklyHours,
            error: withoutError
        },
    }

    const dispatch = useAppDispatch();

    // to display correct input data since it uses defaultValue instead of value
    if (!isFormData) {
        dispatch(jobFormAction.setInitialValues(formValues));
        setIsFormData(true);
    }

    return (
        isFormData ?
            <JobForm formType="update" />
            : null
    )
}

export default UpdateJobContainer