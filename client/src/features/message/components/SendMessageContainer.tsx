import { useEffect, useRef } from "react";
import { MdSend } from "react-icons/md";

const SendMessageContainer = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextareaHight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
        }
    }

    const setMessageContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleTextareaHight();
    }

    const onKeyDownMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            console.log(e.currentTarget.value);
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
            handleTextareaHight();
        }
    }, []);

    return (
        <div className="p-4 flex items-center gap-2 border-t">
            <textarea onKeyDown={onKeyDownMessage} ref={textareaRef} onChange={setMessageContentHandler} name="sendMessage" id="sendMessage" className="max-h-[6rem] w-full border px-3 py-1 outline-none rounded-2xl focus:border-blue-200 resize-none " rows={1} placeholder="Send message.." />
            <button className="py-1 px-[.4rem] rounded flex items-center justify-center bg-white text-blue-600">
                <MdSend size={24} />
            </button>
        </div>
    )
}

export default SendMessageContainer