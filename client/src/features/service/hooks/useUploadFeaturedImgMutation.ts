import { useMutation } from "@tanstack/react-query";
import uploadFeaturedImage from "../services/uploadFeaturedImage";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAppDispatch } from "../../../hooks/redux";
import { serviceFormAction } from "../redux/serviceForm";

const useUploadFeaturedImgMutation = () => {
    const dispatch = useAppDispatch();

    const uploadFeaturedImgMutation = useMutation({
        mutationFn: uploadFeaturedImage,
        onSuccess: (data) => {
            dispatch(serviceFormAction.setFeaturedImage({
                featuredImgURL: data.featuredImgURL
            }));
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong");
        },
        retry: false
    });

    return uploadFeaturedImgMutation;
}

export default useUploadFeaturedImgMutation