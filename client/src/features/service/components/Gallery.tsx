import { TbLoader2, TbTrash } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { createServiceAction } from '../redux/createService';
import uploadImageValidator from '../validators/uploadImageValidator';
import InputContainer from './InputContainer';
import useUploadGalleryMutation from '../hooks/useUploadGalleryMutation';

const Gallery = () => {
    const { gallery } = useAppSelector(state => state.createServiceReducer);
    const dispatch = useAppDispatch();

    const uploadGalleryMutation = useUploadGalleryMutation();

    const uploadGalleryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploadGalleryMutation.isLoading) return;

        const MAX = 5;
        if (gallery.value.length >= MAX) {
            dispatch(createServiceAction.setImageError({
                type: "gallery",
                msg: `${MAX} is the maximum`,
            }));

            return;
        }

        const imgFile = e.currentTarget.files?.item(0);

        const results = uploadImageValidator(imgFile);

        if (results.isError) {
            dispatch(createServiceAction.setImageError({
                type: "gallery",
                msg: results.error
            }));

            return;
        }

        uploadGalleryMutation.mutate(imgFile!);
    }

    const removeGalleryImgHandler = ({ event, img }: { event: React.MouseEvent<HTMLButtonElement, MouseEvent>; img: string }) => {
        event.preventDefault();

        dispatch(createServiceAction.setGalleryImage({
            type: "delete",
            galleryURL: img
        }));
    }

    return (
        <InputContainer label="Gallery" error={gallery.error.msg}>
            {gallery.value.length ?
                <ul className="flex items-center gap-4 flex-wrap">
                    {
                        gallery.value.map(img => (
                            <li key={img} className="mb-1 max-w-[7rem] relative">
                                <img src={img} alt="Service gallery" className="rounded object-contain" />
                                <button type="button" onClick={(e) => removeGalleryImgHandler({ event: e, img })} className="bg-white p-2 rounded-full text-red-600 border absolute -top-4 -right-3 shadow-sm text-xl z-10">
                                    <TbTrash />
                                </button>
                            </li>
                        ))
                    }
                </ul>
                : null
            }
            <input type="file" id="Gallery" name="Gallery" accept="image/png, image/jpeg" className="sr-only" onChange={uploadGalleryHandler} disabled={uploadGalleryMutation.isLoading} />
            <span role="button" className="self-start border-2 rounded border-dashed border-purple-300 bg-purple-100/70 font-medium text-slate-700 h-20 w-28 flex justify-center items-center">
                {uploadGalleryMutation.isLoading ?
                    <TbLoader2 className="animate-spin" size={28} />
                    : "Browse"
                }
            </span>
        </InputContainer>
    )
}

export default Gallery