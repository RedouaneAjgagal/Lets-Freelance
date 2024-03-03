import { TbLoader2 } from "react-icons/tb";
import Overlay from "./Overlay"
import { createPortal } from "react-dom";

interface Props {
    onClose: () => void;
    onConfirm: () => void;
    disabled: boolean;
    title: string;
    desc: string;
    cancelBtnContent: string;
    confirmBtnContent: string;
    color: "blue" | "red" | "purple" | "green" | "black" | "stone";
    isLoading?: boolean;
}

const ActionModal = (props: React.PropsWithoutRef<Props>) => {

    const colorVariants = {
        blue: 'bg-blue-600 border-blue-600 hover:bg-blue-500',
        red: 'bg-red-600 border-red-600 hover:bg-red-500',
        purple: 'bg-purple-600 border-purple-600 hover:bg-purple-500',
        green: 'bg-green-600 border-green-600 hover:bg-green-500',
        black: 'bg-slate-900 border-black-600 hover:bg-slate-800',
        stone: 'bg-stone-600 border-stone-600 hover:bg-stone-500'
    }

    return (
        createPortal(<>
            <Overlay onClose={props.onClose} />
            <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-3">
                <h3 className="text-2xl font-medium">{props.title}</h3>
                <p className=" text-slate-600">{props.desc}</p>
                <div className="flex items-center gap-3 ">
                    <button onClick={props.onConfirm} disabled={props.disabled} className={`${colorVariants[props.color]} duration-200 text-white rounded h-10 px-4 font-medium border border-white flex justify-center min-w-[8rem] items-center relative`}>
                        {props.isLoading ?
                            <>
                                <span className="invisible">
                                    {props.confirmBtnContent}
                                </span>
                                <TbLoader2 className="animate-spin absolute" size={20} />
                            </>
                            : props.confirmBtnContent
                        }
                    </button>
                    <button onClick={props.onClose} disabled={props.disabled} className={`bg-transparent rounded h-10 px-2 font-medium border border-slate-500`}>
                        {props.cancelBtnContent}
                    </button>
                </div>
            </section>
        </>, document.getElementById("overlay")!)
    )
}

export default ActionModal