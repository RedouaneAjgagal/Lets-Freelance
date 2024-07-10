import { createPortal } from "react-dom"
import Overlay from "../../../layouts/Overlay"
import { TbX } from "react-icons/tb";

type JobFormDescriptionModalProps = {
    onClose: () => void;
    description: string;
}

const JobFormDescriptionModal = (props: React.PropsWithoutRef<JobFormDescriptionModalProps>) => {
    return (
        createPortal(
            <div>
                <Overlay onClose={props.onClose} />
                <section className="fixed p-4 max-h-[75%] w-[90%] z-50 shadow-md rounded top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white overflow-y-scroll max-w-[45rem] sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-medium text-slate-700">Job Description:</h2>
                        <button type="button" className="p-1 border rounded text-slate-700" onClick={props.onClose}><TbX size={20} /></button>
                    </div>
                    <div className="bg-slate-100/50 px-3 py-4 rounded ql-editor p-0 [&_ul]:pl-0 [&_ol]:pl-0 [&_blockquote]:pl-2 [&_blockquote]:border-l-4 [&_blockquote]:mb-3" dangerouslySetInnerHTML={{ __html: props.description }}></div>
                </section>
            </div>
            , document.getElementById("overlay")!
        )
    )
}

export default JobFormDescriptionModal