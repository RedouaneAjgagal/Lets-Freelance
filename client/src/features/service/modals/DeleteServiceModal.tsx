import { useEffect } from "react";
import ActionModal from "../../../layouts/ActionModal";
import useDeleteServiceMutation from "../hooks/useDeleteServiceMutation";

type DeleteServiceModalProps = {
    serviceId: string;
    onCloseModal: () => void;
}

const DeleteServiceModal = (props: React.PropsWithoutRef<DeleteServiceModalProps>) => {
    const deleteServiceMutation = useDeleteServiceMutation();

    const deleteServiceHandler = () => {
        deleteServiceMutation.mutate(props.serviceId);
    }

    useEffect(() => {
        if (deleteServiceMutation.isSuccess) {
            props.onCloseModal();
        }
    }, [deleteServiceMutation.isSuccess]);

    return (
        <ActionModal title="Service deletion" confirmBtnContent="Delete service" disabled={deleteServiceMutation.isLoading} cancelBtnContent="Cancel" color="red" desc="Are you sure you want to delete this service?" onClose={props.onCloseModal} onConfirm={deleteServiceHandler} isLoading={deleteServiceMutation.isLoading} />
    )
}

export default DeleteServiceModal