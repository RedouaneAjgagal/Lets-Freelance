import { Link } from "react-router-dom"
import { EventReportsType } from "../services/getEventReports"
import { BiArrowBack } from "react-icons/bi"
import formatDate from "../../../utils/formatDate"
import ActionButton from "../../../layouts/brand/ActionButton"
import { useState } from "react"
import useOverflow from "../../../hooks/useOverflow"
import EventReportModal from "../modals/EventReportModal"

type EventReportItemProps = {
    eventReport: EventReportsType
}

const EventReportItem = (props: React.PropsWithoutRef<EventReportItemProps>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const eventReportModalHandler = () => {
        setIsModalOpen(true);
    }

    const closeModalHandler = () => {
        setIsModalOpen(false)
    }

    useOverflow(isModalOpen);

    return (
        <>
            {isModalOpen
                ? <EventReportModal eventReport={props.eventReport} onClose={closeModalHandler} />
                : null
            }
            <tr className="border-t">
                <td className="p-2 py-4">
                    <h5 className="capitalize">{props.eventReport.event}</h5>
                </td>
                <td className="p-2 py-4">
                    <div className="flex flex-col">
                        <span className="capitalize text-sm text-slate-600">{props.eventReport.submittedBy.userAs}</span>
                        <Link target="_blank" rel="noopener noreferrer" to={`/profiles/${props.eventReport.submittedBy.profile}`} className="capitalize flex items-center gap-1 self-start text-blue-700 text-lg">
                            {props.eventReport.submittedBy.name}
                            <BiArrowBack className="rotate-[135deg]" />
                        </Link>
                    </div>
                </td>
                <td className="p-2 py-4">
                    <p className="line-clamp-2">{props.eventReport.subject}</p>
                </td>
                <td className="p-2 py-4">
                    <span>
                        {formatDate(props.eventReport.createdAt)}
                    </span>
                </td>
                <td className="p-2 py-4">
                    <div>
                        <ActionButton type="view" onClick={eventReportModalHandler} />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default EventReportItem