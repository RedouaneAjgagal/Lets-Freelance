import { useMutation } from "@tanstack/react-query";
import uploadAvatar from "../services/uploadAvatar";

const useUploadAvatarMutation = () => {
    const uploadAvatarMutation = useMutation({
        mutationKey: ["uploadAvatar"],
        mutationFn: uploadAvatar
    });
    return uploadAvatarMutation;
}

export default useUploadAvatarMutation