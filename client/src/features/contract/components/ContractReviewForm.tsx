import { useEffect, useState } from "react";
import { PrimaryButton } from "../../../layouts/brand";
import { ContractReviewType } from "../services/getUserSingleContract";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateReviewPayload, CreateReviewResponse, UpdateReviewPayload, UpdateReviewResponse } from "../../reviews";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";

type ContractCreateReviewForm = {
    type: "create";
    onSubmit: UseMutationResult<CreateReviewResponse, AxiosError<{
        msg: string;
    }, any>, CreateReviewPayload, unknown>;
}

type ContractUpdateReviewForm = {
    type: "update";
    review: ContractReviewType;
    onSubmit: UseMutationResult<UpdateReviewResponse, AxiosError<{
        msg: string;
    }, any>, UpdateReviewPayload, unknown>;
    onClose: () => void;
}

type ContractReviewFormProps = (ContractCreateReviewForm | ContractUpdateReviewForm);

const ContractReviewForm = (props: React.PropsWithoutRef<ContractReviewFormProps>) => {
    const DESCRIPTION_MAX_LENGTH = 2000;

    const { contractId } = useParams();

    const [rate, setRate] = useState({
        value: props.type === "update" ? props.review.rating : 0,
        error: ""
    });

    const [description, setDescription] = useState({
        value: (props.type === "update" && props.review.description) ? props.review.description : "",
        error: ""
    });

    const rateOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const rating = value > 5 ? 5 : value < 0 ? 1 : value;

        setRate({ value: rating, error: "" });
    }

    const descriptionOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        if (value.length > DESCRIPTION_MAX_LENGTH) return;

        setDescription({ value, error: "" });
    }

    const submitContractHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let ratingError = "";
        let descriptionError = "";

        if (rate.value < 1 || rate.value > 5) {
            ratingError = "Invalid rating value";
        }

        if (description.value !== "" && description.value.trim() === "") {
            descriptionError = "Description can't be empty";
        }

        if (description.value.length > DESCRIPTION_MAX_LENGTH) {
            descriptionError = `limited to ${DESCRIPTION_MAX_LENGTH} characters`;
        }

        if (descriptionError !== "") {
            setDescription(prev => {
                return {
                    ...prev,
                    error: descriptionError
                }
            });
        }

        if (ratingError !== "") {
            setRate(prev => {
                return {
                    ...prev,
                    error: ratingError
                }
            });
        }

        if (ratingError !== "" || descriptionError !== "") return;

        const rating = Number(rate.value.toFixed(2));

        if (props.type === "create") {
            props.onSubmit.mutate({
                contractId: contractId!,
                rating,
                description: description.value
            });
        } else {
            props.onSubmit.mutate({
                reviewId: props.review._id,
                rating,
                description: description.value
            });
        }
    }

    useEffect(() => {
        if (props.onSubmit.isSuccess && props.type === "update") {
            props.onClose();
        }
    }, [props.onSubmit.isSuccess]);

    return (
        <form onSubmit={submitContractHandler} className="flex flex-col gap-2" noValidate>
            <div className="flex items-center gap-3">
                <label htmlFor="rateContractReview" className="font-medium">
                    Rate
                    <span className="text-sm font-normal text-slate-500 ml-1">(1-5)</span>
                </label>
                <input id="rateContractReview" name="rateContractReview" type="number" min={1} max={5} className={`border-2 rounded px-2 py-[.15rem] w-20 ${rate.error === "" ? "border-slate-300" : "border-red-300"}`} onChange={rateOnChange} value={rate.value === 0 ? "" : rate.value} />
            </div>
            <div className="flex flex-col gap-1 relative">
                <label htmlFor="descriptionContractReview" className="font-medium">Description</label>
                <textarea name="descriptionContractReview" id="descriptionContractReview" className={`border-2 text-slate-600 rounded py-2 px-3 w-full resize-none min-h-[14rem] ${description.error === "" ? "border-slate-300" : "border-red-300 "}`} onChange={descriptionOnChange} value={description.value} maxLength={DESCRIPTION_MAX_LENGTH}></textarea>
                <small className="self-end text-slate-600">{`${description.value.length} / ${DESCRIPTION_MAX_LENGTH}`}</small>
            </div>
            <div className="flex items-center justify-between mt-3">
                <PrimaryButton disabled={props.onSubmit.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" isLoading={props.onSubmit.isLoading}>
                    {`${props.type === "create" ? "Submit" : "Update"} Review`}
                </PrimaryButton>
                {props.type === "update" ?
                    <button type="button" onClick={props.onClose} className="font-medium">Cancel</button>
                    : null
                }
            </div>
        </form>
    )
}

export default ContractReviewForm