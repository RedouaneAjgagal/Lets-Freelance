import { useEffect } from "react";
import ActionModal from "../../../layouts/ActionModal";
import useMarkJobAsClosedMutation from "../hooks/useMarkJobAsClosedMutation";

type CloseJobModalProps = {
    onClose: () => void;
    jobId: string;
    sectionRef: React.RefObject<HTMLSelectElement>;
}

const CloseJobModal = (props: React.PropsWithoutRef<CloseJobModalProps>) => {
    const markJobAsClosedMutation = useMarkJobAsClosedMutation({
        jobId: props.jobId
    });

    const markJobAsCloseHandler = () => {
        markJobAsClosedMutation.mutate({
            jobId: props.jobId,
            payload: {
                status: "closed"
            }
        });
    }

    useEffect(() => {
        if (markJobAsClosedMutation.isSuccess) {
            props.onClose();
            props.sectionRef.current!.scrollTo({
                left: 0,
                behavior: "instant"
            });
        }
    }, [markJobAsClosedMutation.isSuccess]);

    return (
        <ActionModal cancelBtnContent="Cancel" color="stone" confirmBtnContent="Close job" title="Mark your job as a closed job?" desc="Are you sure you want to mark your job as closed job? You will no further receive proposals on this job" onConfirm={markJobAsCloseHandler} disabled={markJobAsClosedMutation.isLoading} isLoading={markJobAsClosedMutation.isLoading} onClose={props.onClose} />
    )
}

export default CloseJobModal