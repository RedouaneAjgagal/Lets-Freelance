import { postRequest } from "../../../services/api";

type UploadFeaturedImageType = {
    featuredImgURL: string;
}

const uploadFeaturedImage = async (img: File) => {
    const formData = new FormData();

    formData.append("featuredServiceImg", img);

    const response = await postRequest("services/upload-featured", formData, true);
    const data = await response.data as UploadFeaturedImageType;
    return data;
};

export default uploadFeaturedImage;