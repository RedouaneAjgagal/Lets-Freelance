import { createPortal } from "react-dom"
import Overlay from "../../../layouts/Overlay";
import { TbX } from "react-icons/tb";

type DescriptionModalProps = {
    title?: string;
    description: string;
    onClose: () => void;
}

const DescriptionModal = (props: React.PropsWithoutRef<DescriptionModalProps>) => {

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <div className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-4 max-h-[80%]">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{props.title ? props.title : "Description:"}</h3>
                        <button onClick={props.onClose}><TbX size={20} /></button>
                    </div>
                    <div className="p-3 bg-slate-200/50 rounded min-h-[6rem] max-h-[24rem] overflow-y-scroll">
                        <div dangerouslySetInnerHTML={{ __html: props.description }}></div>
                    </div>
                </div>
            </>
            , document.getElementById("overlay")!
        )
    )
}

export default DescriptionModal