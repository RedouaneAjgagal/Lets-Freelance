import React from 'react'
import { ImSpinner2 } from "react-icons/im";

interface Props {
    label: string;
    name: string;
    isError: boolean;
    error: string;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imageURL: string;
    isLoading: boolean;
}

const ImageInputContainer = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="inline-flex relative">
            <label htmlFor={`${props.name}Uploader`} className="grid gap-2 cursor-pointer font-medium">
                {props.label}
                <div className='relative self-start'>
                    <img src={props.imageURL} className="rounded w-24 h-24 object-cover border-2 border-dashed border-slate-400" />
                    {props.isLoading ?
                        <div className={`absolute left-[36%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-full flex justify-center items-center bg-slate-700/90 rounded`}>
                            <ImSpinner2 className="animate-spin text-purple-300 text-4xl" />
                        </div>
                        :
                        null
                    }
                </div>
            </label>
            <input type="text" name={props.name} id={props.name} className="sr-only" value={props.imageURL} readOnly />
            <input onChange={props.onUploadImage} name={`${props.name}Uploader`} id={`${props.name}Uploader`} className="sr-only" type="file" accept="image/*" disabled={props.isLoading} />
            {props.isError ?
                <span className="absolute left-0 -bottom-5 text-sm text-red-600">{props.error}</span>
                :
                null
            }
        </div>
    )
}

export default ImageInputContainer