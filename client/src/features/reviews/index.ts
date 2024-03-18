import useServiceReviewsQuery from "./hooks/useServiceReviewsQuery";
import useProfileReviewsQuery from "./hooks/useProfileReviewsQuery";
import useCreateReviewMutaion from "./hooks/useCreateReviewMutaion";
import useUpdateReviewMutation from "./hooks/useUpdateReviewMutation";
import useDeleteReviewMutation from "./hooks/useDeleteReviewMutation";
import { CreateReviewResponse, CreateReviewPayload } from "./services/createReview";
import { UpdateReviewResponse, UpdateReviewPayload } from "./services/updateReview";

export {
    useServiceReviewsQuery,
    useProfileReviewsQuery,
    useCreateReviewMutaion,
    useUpdateReviewMutation,
    useDeleteReviewMutation
}

export type {
    CreateReviewResponse,
    CreateReviewPayload,
    UpdateReviewPayload,
    UpdateReviewResponse
}