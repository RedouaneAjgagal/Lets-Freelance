import { MdArrowBackIos } from "react-icons/md"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { AnalyticsTypes, AccessAnalyticsTypes } from "./AnalyticsContainer";
import { useState } from "react";

type AnalyticsNavbarProps = {
    role: "admin" | "owner";
    onSelect: (value: AnalyticsTypes) => void;
    validAccessAnalytics: AccessAnalyticsTypes[];
    currentAnalytics: AnalyticsTypes;
}

const AnalyticsNavbar = (props: React.PropsWithoutRef<AnalyticsNavbarProps>) => {
    const [isOpen, setIsOpen] = useState(false);

    const validAccessAnalytics = props.validAccessAnalytics.filter(analytics => analytics.accessBy.includes(props.role));

    const toggleAnalyticsMenu = () => {
        setIsOpen(prev => !prev);
    }

    const validAnalytics = validAccessAnalytics.map(analytics => {
        const selectAnalytics = () => {
            props.onSelect(analytics.value);
            setIsOpen(false);
        }

        return (
            <button key={analytics.value} onClick={selectAnalytics} className={`px-3 w-full text-left py-2 border-b last:border-0 capitalize ${props.currentAnalytics === analytics.value ? "bg-slate-900 text-white rounded" : "bg-white text-slate-900"}`}>{analytics.value}</button>
        )
    });

    return (
        <nav className="flex justify-start relative">
            <button onClick={toggleAnalyticsMenu} className="flex items-center gap-1 font-medium bg-white shadow-sm border rounded px-3 pb-1 pt-2 outline-none text-slate-900">
                <TbBrandGoogleAnalytics size={24} className="mb-2" />
                Analytics
                <MdArrowBackIos className={`${isOpen ? "rotate-90 -mb-1" : "-rotate-90 mb-2"} transition-all ml-2`} />
            </button>
            {
                isOpen ?
                    <div className="absolute top-12 bg-white shadow-sm border rounded flex-col min-w-[10rem] font-medium flex z-20">
                        {validAnalytics}
                    </div>
                    : null
            }
        </nav>
    )
}

export default AnalyticsNavbar