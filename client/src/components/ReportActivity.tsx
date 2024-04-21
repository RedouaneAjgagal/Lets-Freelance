import { useState } from "react";
import { TiWarning } from "react-icons/ti";
import useOverflow from "../hooks/useOverflow";
import ReportModal from "./ReportModal";

type ReportActivityProps = {
    activity: "profile" | "job" | "service";
    target: string;
}

const ReportActivity = (props: React.PropsWithoutRef<ReportActivityProps>) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const openReportModelHandler = () => {
        setIsReportModalOpen(true);
    }

    const closeReportModelHandler = () => {
        setIsReportModalOpen(false);
    }

    useOverflow(isReportModalOpen);

    return (
        <div>
            {isReportModalOpen ? <ReportModal onCLose={closeReportModelHandler} activity={props.activity} target={props.target} /> : null}
            <button onClick={openReportModelHandler} className="flex items-center gap-2 font-medium text-2xl p-1 text-orange-400">
                <TiWarning />
            </button>
        </div>
    )
}

export default ReportActivity;