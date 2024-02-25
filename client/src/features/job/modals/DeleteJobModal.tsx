import { useEffect } from "react";
import ActionModal from "../../../layouts/ActionModal";
import useDeleteJobMutation from "../hooks/useDeleteJobMutation";

type DeleteJobModalProps = {
    closeModalhandler: () => void;
    jobId: string;
    sectionRef: React.RefObject<HTMLSelectElement>;
}

const DeleteJobModal = (props: React.PropsWithoutRef<DeleteJobModalProps>) => {
    const deleteJobMutation = useDeleteJobMutation();

    const deleteJobHanlder = () => {
        deleteJobMutation.mutate(props.jobId);
    }

    useEffect(() => {
        if (deleteJobMutation.isSuccess) {
            props.closeModalhandler();
            props.sectionRef.current!.scrollTo({
                behavior: "instant",
                left: 0
            });
        }
    }, [deleteJobMutation.isSuccess]);

    return (
        <ActionModal onClose={props.closeModalhandler} cancelBtnContent="Cancel" color="red" confirmBtnContent="Delete job" desc="Are you sure you want to delete this job?" onConfirm={deleteJobHanlder} title="Job deletion" disabled={deleteJobMutation.isLoading} isLoading={deleteJobMutation.isLoading} />
    )
}

export default DeleteJobModal