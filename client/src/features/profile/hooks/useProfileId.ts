import { useParams } from "react-router-dom"

const useProfileId = () => {
    const { profileId } = useParams();
    return profileId
}

export default useProfileId;