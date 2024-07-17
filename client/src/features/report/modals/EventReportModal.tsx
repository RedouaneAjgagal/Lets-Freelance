import { createPortal } from "react-dom";
import { EventReportsType } from "../services/getEventReports";
import Overlay from "../../../layouts/Overlay";
import { TbX } from "react-icons/tb";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

type EventReportModalProps = {
    onClose: () => void;
    eventReport: EventReportsType;
}

const EventReportModal = (props: React.PropsWithoutRef<EventReportModalProps>) => {

    const eventLink = props.eventReport.event === "job"
        ? `/jobs/${props.eventReport.job}`
        : props.eventReport.event === "service"
            ? `/services/${props.eventReport.service}`
            : `/profiles/${props.eventReport.profile}`;

    const reportedAt = new Date(props.eventReport.createdAt).toUTCString();

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-2 min-h-[90%] max-h-[90%] overflow-y-scroll max-w-[45rem]">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">Event report</h2>
                        <button onClick={props.onClose} className="p-1">
                            <TbX size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        <article className="flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800">
                                General Info
                            </h3>
                            <div>
                                <h5 className="font-medium">Report ID:</h5>
                                <span className="text-slate-600">{props.eventReport._id}</span>
                            </div>
                            <div className="flex flex-col">
                                <h5 className="font-medium">Event:</h5>
                                <Link to={eventLink} target="_blank" rel="noopener noreferrer" className="capitalize flex items-center gap-1 border-b border-slate-600 self-start">{props.eventReport.event}
                                    <BiArrowBack className="rotate-[135deg]" />
                                </Link>
                            </div>
                        </article>
                        <article className="flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800">
                                Report Info
                            </h3>
                            <div>
                                <h5 className="font-medium">Subject:</h5>
                                <span className="text-slate-600">{props.eventReport.subject}</span>
                            </div>
                            {props.eventReport.message
                                ? <div>
                                    <h5 className="font-medium">Message:</h5>
                                    <span className="text-slate-600">{props.eventReport.message}</span>
                                </div>
                                : null
                            }
                        </article>
                        <article className="flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800">
                                Reported by
                            </h3>
                            <div className="flex flex-col">
                                <h5 className="font-medium">User:</h5>
                                <div className="flex items-start gap-2">
                                    <Link target="_blank" rel="noopener noreferrer" to={`/profiles/${props.eventReport.submittedBy.profile}`} className="capitalize flex items-center gap-1 border-b border-slate-600 self-start">
                                        {props.eventReport.submittedBy.name}
                                        <BiArrowBack className="rotate-[135deg]" />
                                    </Link>
                                    <span className="capitalize text-sm text-slate-600">{props.eventReport.submittedBy.userAs}</span>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium">Reported at:</h5>
                                <span className="text-slate-600">{reportedAt}</span>
                            </div>
                        </article>
                    </div>
                </section>
            </>
            , document.getElementById("overlay")!
        )
    )
}

export default EventReportModal