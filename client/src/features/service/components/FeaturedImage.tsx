import React from 'react'
import InputContainer from './InputContainer'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { serviceFormAction } from '../redux/serviceForm';
import useUploadFeaturedImgMutation from '../hooks/useUploadFeaturedImgMutation';
import { TbTrash } from 'react-icons/tb';
import uploadImageValidator from '../validators/uploadImageValidator';
import { TbLoader2 } from "react-icons/tb";

const FeaturedImage = () => {
    const { featuredImage } = useAppSelector(state => state.serviceFormReducer);
    const dispatch = useAppDispatch();

    const uploadFeaturedImgMutation = useUploadFeaturedImgMutation();

    const uploadFeaturedImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploadFeaturedImgMutation.isLoading) return;

        const imgFile = e.currentTarget.files?.item(0);

        const results = uploadImageValidator(imgFile);

        if (results.isError) {
            dispatch(serviceFormAction.setImageError({
                type: "featuredImage",
                msg: results.error
            }));

            return;
        }

        uploadFeaturedImgMutation.mutate(imgFile!);
    }

    const removeFeaturedImgHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(serviceFormAction.setFeaturedImage({ featuredImgURL: "" }));
    }

    return (
        <InputContainer label="Featured image" error={featuredImage.error.msg} id="featuredImage" isErrorLeftSide>
            {featuredImage.value ?
                <div className="mb-1 max-w-[12rem] relative">
                    <img src={featuredImage.value} alt="Featured service image" className="rounded object-contain " />
                    <button type="button" onClick={removeFeaturedImgHandler} className="bg-white p-2 rounded-full text-red-600 border absolute -top-4 -right-3 shadow-sm text-2xl">
                        <TbTrash />
                    </button>
                </div>
                : null
            }
            <input type="file" id="featuredImage" name="Featured image" accept="image/png, image/jpeg" className="sr-only" onChange={uploadFeaturedImageHandler} disabled={uploadFeaturedImgMutation.isLoading} />
            <span role="button" className="self-start border-2 rounded border-dashed border-purple-300 bg-purple-100/70 font-medium text-slate-700 h-20 w-28 flex justify-center items-center">
                {uploadFeaturedImgMutation.isLoading ?
                    <TbLoader2 className="animate-spin" size={28} />
                    : "Browse"
                }
            </span>
        </InputContainer>
    )
}

export default FeaturedImage