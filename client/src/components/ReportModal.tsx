import Overlay from "../layouts/Overlay";
import { PrimaryButton } from "../layouts/brand";
import { BiArrowBack, BiX } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { SubmitReportPayload, useSubmitReportMutation } from "../features/report";

interface Props {
    onCLose: () => void;
    activity: "profile" | "job" | "service";
    target: string;
}

const ReportModal = (props: React.PropsWithoutRef<Props>) => {
    const reportSubjectRef = useRef<HTMLInputElement>(null);
    const reportMessageRef = useRef<HTMLTextAreaElement>(null);
    const [subjectError, setSubjectError] = useState("");

    const submitReportMutation = useSubmitReportMutation();

    const reportProfileSubmission = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubjectError("");

        const subject = reportSubjectRef.current!.value.trim();
        const message = reportMessageRef.current!.value.trim();

        const report: SubmitReportPayload = {
            target: props.target,
            event: props.activity,
            subject
        }

        if (message && message.trim() !== "") {
            report.message = message;
        }

        if (!subject || subject.trim() === "") {
            setSubjectError("Subject is required");
            return;
        }

        submitReportMutation.mutate(report);
    }

    const reportTitle = `Report this ${props.activity}`;

    useEffect(() => {
        if (submitReportMutation.isSuccess) {
            props.onCLose();
        }
    }, [submitReportMutation.isSuccess]);

    return (
        <>
            <Overlay onClose={props.onCLose} />
            <div className="fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 z-50 rounded flex flex-col gap-6 max-w-[45rem]">
                <button onClick={props.onCLose} className="absolute right-0 top-0 p-1 text-3xl sm:py-2 sm:px-4">
                    <BiX />
                </button>
                <h4 className="text-2xl font-medium">{reportTitle}</h4>
                <form onSubmit={reportProfileSubmission} className="flex flex-col gap-6">
                    <div className="relative">
                        <input type="text" placeholder="Subject *" name="reportSubject" id="subject" className={`${subjectError ? "border-red-600" : "border-slate-300"} border rounded w-full p-2`} ref={reportSubjectRef} />
                        {subjectError ? <p className="absolute -bottom-5 right-0 text-sm text-red-600">{subjectError}</p> : null}
                    </div>
                    <textarea name="reportMessage" id="reportMessage" rows={4} placeholder="Message" className="border border-slate-300 rounded w-full p-2 resize-none" ref={reportMessageRef}></textarea>
                    <div className="lg:flex lg:self-start">
                        <PrimaryButton style="outline" fullWith x="lg" y="md" justifyConent="center" type="submit" disabled={submitReportMutation.isLoading} isLoading={submitReportMutation.isLoading}>
                            Send Report
                            <BiArrowBack className="rotate-[135deg] text-2xl" />
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ReportModal;