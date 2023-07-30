import { UploadedFile } from "express-fileupload";
import { BadRequestError } from "../errors";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

type UploadImage = {
    imageFile: UploadedFile;
    maxSize: number;
    folderName: string;
}

const uploadImage = async ({ imageFile, maxSize, folderName }: UploadImage) => {
    if (!imageFile) {
        throw new BadRequestError("Must provide an image");
    }
    if (!imageFile.mimetype.startsWith("image")) {
        fs.rmSync(imageFile.tempFilePath)
        throw new BadRequestError("Only images are supported");
    }
    if (imageFile.mimetype.startsWith("image/svg")) {
        fs.rmSync(imageFile.tempFilePath)
        throw new BadRequestError("svg is not supported");
    }
    if (imageFile.size > maxSize) {
        fs.rmSync(imageFile.tempFilePath)
        throw new BadRequestError("Image is too large");
    }

    const imageResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: folderName,
        resource_type: "image",
        format: "webp",
        allowed_formats: ["webp"]
    });

    fs.rmSync(imageFile.tempFilePath);

    return imageResponse;
}

export default uploadImage;