import { useMutation } from "@tanstack/react-query";
import uploadAvatar from "../services/uploadAvatar";

const useUploadAvatarMutation = () => {
    const uploadAvatarMutation = useMutation({
        mutationFn: uploadAvatar,
    });
    return uploadAvatarMutation;
}

export default useUploadAvatarMutation