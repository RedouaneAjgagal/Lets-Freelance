import { useState } from 'react'
import Input from '../../../components/Input';
import { TbX } from 'react-icons/tb';

type JobFormTagsProps = {
    isError: boolean;
    defaultValue: string[];
}


const JobFormTags = (props: React.PropsWithoutRef<JobFormTagsProps>) => {

    const initialTags = props.defaultValue.map(tag => {
        const id = crypto.randomUUID();
        return { _id: id, value: tag }
    });

    const [{ tagValue, tags }, setTag] = useState<{
        tagValue: string;
        tags: { _id: string; value: string }[];
    }>({ tagValue: "", tags: initialTags });

    const setTagValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagValue = e.currentTarget.value;
        setTag(prev => {
            return { ...prev, tagValue }
        });
    }

    const addTagHandler = () => {
        if (tags.length >= 10) return;

        const keywordId = crypto.randomUUID();
        if (!tagValue || tagValue.trim() === "") return;

        setTag(prev => {
            return {
                tags: [...prev.tags, { _id: keywordId, value: prev.tagValue }],
                tagValue: ""
            }
        })
    }

    const addTagHandlerByKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        addTagHandler();

        e.preventDefault();
    }

    const removeKeywordHandler = (tagId: string) => {
        setTag(prev => {
            return {
                ...prev,
                tags: prev.tags.filter(tag => tag._id !== tagId)
            }
        });
    }

    const getTagValues = tags.map(tag => tag.value).join("***");

    return (
        <div className="relative pb-6 flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Input errorMsg="" isError={props.isError} id="job_tag_input" name="job_tag_input" includeLabel={true} labelContent="Add job tags" type="text" placeHolder="e.g. Web development" onChange={setTagValueHandler} onKeyDown={addTagHandlerByKeyDown} value={tagValue} />
                {tags.length < 10 ?
                    <button onClick={addTagHandler} type="button" className="bg-slate-200 py-[.4rem] rounded px-4 font-medium -mb-2">Add</button>
                    : null
                }
                <input type="text" name="job_tag" id="job_tag" value={getTagValues} readOnly className="sr-only" hidden />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                    <button onClick={() => removeKeywordHandler(tag._id)} key={tag._id} type="button" className="flex items-center gap-1 text-sm rounded-full border py-1 px-2 border-slate-600 relative">
                        {tag.value.toLowerCase()}
                        <span className="bg-slate-400 rounded-full text-white h-4 w-4 flex items-center justify-center"><TbX /></span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default JobFormTags