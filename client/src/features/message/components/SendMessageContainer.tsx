import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { useAppDispatch } from "../../../hooks/redux";
import { sendWebsocketMessage } from "../redux/websocketMessageSlice";

type SendMessageContainerProps = {
    contactId: string;
}

const SendMessageContainer = (props: React.PropsWithoutRef<SendMessageContainerProps>) => {
    const dispatch = useAppDispatch();
    const [messageContent, setMessageContent] = useState<string>("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextareaHight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
        }
    }

    const setMessageContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const message = e.target.value;
        setMessageContent(message.toString());
    }

    const sendMessageHandler = () => {
        // handleTextareaHight();
        console.log(messageContent);
        dispatch(sendWebsocketMessage({
            content: messageContent,
            receiver: props.contactId
        }));

        setMessageContent("");
    };

    const onKeyDownMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessageHandler()
        };
    }

    useEffect(() => {
        if (textareaRef.current) {
            handleTextareaHight();
        }
    }, [messageContent]);

    return (
        <div className="p-4 flex items-center gap-2 border-t">
            <textarea onKeyDown={onKeyDownMessage} ref={textareaRef} onChange={setMessageContentHandler} value={messageContent} name="sendMessage" id="sendMessage" className="max-h-[7rem] w-full border border-slate-300 focus:border-slate-400 px-3 py-1 outline-none rounded-2xl resize-none bg-stone-100/50 placeholder:text-slate-600" rows={1} placeholder="Send message.." />
            <button onClick={sendMessageHandler} className="py-1 px-[.4rem] rounded flex items-center justify-center bg-white text-blue-600">
                <MdSend size={24} />
            </button>
        </div>
    )
}

export default SendMessageContainer