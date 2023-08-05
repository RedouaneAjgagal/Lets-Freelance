import Overlay from "../../../layouts/Overlay"
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack, BiX } from "react-icons/bi";
import { useRef, useState } from "react";

interface Props {
    onCLose: () => void;
}

const ReportModel = (props: React.PropsWithoutRef<Props>) => {
    const reportSubjectRef = useRef<HTMLInputElement>(null);
    const reportMessageRef = useRef<HTMLTextAreaElement>(null);
    const [subjectError, setSubjectError] = useState("");

    const reportProfileSubmission = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubjectError("");
        const report = {
            subject: reportSubjectRef.current!.value.trim(),
            message: reportMessageRef.current!.value.trim()
        }

        if (!report.subject || report.subject.trim() === "") {
            setSubjectError("Subject is required");
            return;
        }

        console.log(report);
    }

    return (
        <>
            <Overlay onClose={props.onCLose} />
            <div className="fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 z-50 rounded flex flex-col gap-6">
                <button onClick={props.onCLose} className="absolute right-0 top-0 p-1 text-3xl">
                    <BiX />
                </button>
                <h4 className="text-2xl font-medium">Report this profile</h4>
                <form onSubmit={reportProfileSubmission} className="flex flex-col gap-6">
                    <div className="relative">
                        <input type="text" placeholder="Subject *" name="reportSubject" id="subject" className={`${subjectError ? "border-red-600" : "border-slate-300"} border rounded w-full p-2`} ref={reportSubjectRef} />
                        {subjectError ? <p className="absolute -bottom-5 right-0 text-sm text-red-600">{subjectError}</p> : null}
                    </div>
                    <textarea name="reportMessage" id="reportMessage" rows={3} placeholder="Message" className="border border-slate-300 rounded w-full p-2 resize-none" ref={reportMessageRef}></textarea>
                    <PrimaryButton style="outline" fullWith x="md" y="md" justifyConent="center" type="submit" disabled={false}>Send Report<BiArrowBack className="rotate-[135deg] text-2xl" /></PrimaryButton>
                </form>
            </div>
        </>
    )
}

export default ReportModel