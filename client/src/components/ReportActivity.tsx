import { useState } from "react";
import { TiWarning } from "react-icons/ti";
import useOverflow from "../hooks/useOverflow";
import ReportModal from "./ReportModal";
import { useAppSelector } from "../hooks/redux";
import toast from "react-hot-toast";

type ReportActivityProps = {
    activity: "profile" | "job" | "service";
    target: string;
}

const ReportActivity = (props: React.PropsWithoutRef<ReportActivityProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const openReportModelHandler = () => {
        if (!userInfo) {
            toast.error(`You must login first to be able to report ${props.activity}s`, {
                id: "error_reportActivity"
            });
            return;
        }
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