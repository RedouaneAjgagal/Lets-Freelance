import Overlay from "../../../layouts/Overlay";
import { createPortal } from "react-dom";

type CoverLetterModalProps = {
    onClose: () => void;
    coverLetterContent: string;
}

const CoverLetterModal = (props: React.PropsWithoutRef<CoverLetterModalProps>) => {
    const coverLetterContent = props.coverLetterContent.replace(/\n/g, "<br>");

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-4 max-h-[80%] max-w-[45rem] sm:p-6">
                    <h2 className="text-xl font-semibold">Cover letter content</h2>
                    <div className="p-3 bg-slate-200/50 rounded min-h-[6rem] max-h-[24rem] overflow-y-scroll">
                        <i className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: coverLetterContent }}></i>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-slate-600 text-white p-2 rounded font-medium tracking-wide" onClick={props.onClose}>Close</button>
                    </div>
                </section>
            </>
            ,
            document.getElementById("overlay")!
        )
    )
}

export default CoverLetterModal