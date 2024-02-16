import { useMutation } from '@tanstack/react-query'
import uploadGallery from '../services/uploadGallery'
import { useAppDispatch } from '../../../hooks/redux'
import { serviceFormAction } from '../redux/serviceForm'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

const useUploadGalleryMutation = () => {
    const dispatch = useAppDispatch();

    const uploadGalleryMutation = useMutation({
        mutationFn: uploadGallery,
        onSuccess: (data) => {
            dispatch(serviceFormAction.setGalleryImage({
                type: "add",
                galleryURL: data.galleryImgURL
            }));
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong");
        },
        retry: false
    });

    return uploadGalleryMutation;
}

export default useUploadGalleryMutation