import { postRequest } from "../../../services/api";

type UploadGalleryType = {
    galleryImgURL: string;
};

const uploadGallery = async (galleryImg: File) => {
    const formData = new FormData();

    formData.append("gallery", galleryImg);

    const response = await postRequest("services/upload-gallery", formData, true);
    const data = await response.data as UploadGalleryType;
    return data;
};

export default uploadGallery;