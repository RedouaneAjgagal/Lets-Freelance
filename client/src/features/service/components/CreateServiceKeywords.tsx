import { useState } from 'react'
import { BsX } from 'react-icons/bs';

type CreateServiceKeywordsProps = {
    setKeyword: ({ id, keyword }: { id: string; keyword: string }) => void;
    onRemoveKeyword: (keywordId: string) => void
    keywords: { id: string; keyword: string }[];
    error: string;
}

const CreateServiceKeywords = (props: React.PropsWithoutRef<CreateServiceKeywordsProps>) => {
    const MAX_KEYWORDS = 5;

    const placeholderContent: { [key: number]: string } = {
        2: "One more",
        1: "Two left",
        0: "Add at least 3 keywords"
    }

    const [keywordValue, setKeywordValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!keywordValue.length || keywordValue.trim() === "") {
                return "";
            }

            props.setKeyword({
                id: crypto.randomUUID(),
                keyword: keywordValue.trim()
            });

            setKeywordValue("");
        }
    }

    const setTagHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.currentTarget.value;
        setKeywordValue(keyword);
    }

    const removeKeyword = (keywordId: string) => {
        props.onRemoveKeyword(keywordId);
    }


    return (
        <div>
            <div className="relative pb-6 flex flex-col gap-1">
                <label htmlFor="Keywords" className="text-lg font-medium flex flex-col gap-1">
                    Keywords
                </label>
                <div className={`border-2 rounded p-1 bg-white flex justify-start flex-wrap gap-x-4 gap-y-2 ${props.error ? "border-red-300" : "border-slate-300"}`}>
                    {props.keywords.length ?
                        <div className="flex items-center gap-2 font-medium flex-wrap">
                            {props.keywords.map(({ id, keyword }) => (
                                <button key={id} className="bg-slate-200/70 h-8 px-2 rounded flex items-center gap-1" onClick={() => removeKeyword(id)}>
                                    {keyword.toLowerCase()}
                                    <BsX size={20} />
                                </button>
                            ))}
                        </div>
                        : null
                    }
                    {props.keywords.length !== MAX_KEYWORDS ?
                        <input id="Keywords" type="text" placeholder={`${placeholderContent[props.keywords.length] || "Add more"}`} className="outline-none min-w-[10rem] font-medium px-1" onChange={setTagHanlder} onKeyDown={handleKeyDown} value={keywordValue} />
                        : null
                    }
                </div>
                {props.error ?
                    <span className="absolute right-0 bottom-1 text-red-600 text-sm">{props.error}</span>
                    : null
                }
            </div>
        </div>
    )
}

export default CreateServiceKeywords