import { useState } from "react";
import { TiWarning } from "react-icons/ti";
import ReportModel from "../Models/ReportModel";
import useOverflow from "../../../hooks/useOverflow";

const ReportProfile = () => {
    const [isReportModelOpen, setIsReportModelOpen] = useState(false);

    const openReportModelHandler = () => {
        setIsReportModelOpen(true);
    }

    const closeReportModelHandler = () => {
        setIsReportModelOpen(false);
    }

    useOverflow(isReportModelOpen);

    return (
        <div>
            {isReportModelOpen ? <ReportModel onCLose={closeReportModelHandler} /> : null}
            <button onClick={openReportModelHandler} className="flex items-center gap-2 font-medium text-2xl p-1 text-orange-400">
                <TiWarning />
            </button>
        </div>
    )
}

export default ReportProfile