import { useEffect } from "react";
import { PrimaryButton } from "../../../layouts/brand"
import useCancelContractRequestMutation from "../hooks/useCancelContractRequestMutation";
import { TbLoader2 } from "react-icons/tb";

type CancelContractCtaProps = {
    onClose: () => void;
    contractId: string;
};

const CancelContractCta = (props: React.PropsWithoutRef<CancelContractCtaProps>) => {
    const cancelContractRequestMutation = useCancelContractRequestMutation();

    const cancelContractHandler = () => {
        if (cancelContractRequestMutation.isLoading) return;

        cancelContractRequestMutation.mutateAsync({
            status: "canceled",
            contractId: props.contractId
        });
    }

    const keepContractHandler = () => {
        if (cancelContractRequestMutation.isLoading) return;

        cancelContractRequestMutation.mutate({
            status: "inProgress",
            contractId: props.contractId
        });
    }

    useEffect(() => {
        if (cancelContractRequestMutation.isSuccess) {
            props.onClose();
        }
    }, [cancelContractRequestMutation.isSuccess]);

    return (
        <div className="flex justify-between flex-wrap gap-3">
            <PrimaryButton onClick={keepContractHandler} disabled={cancelContractRequestMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="button" x="lg" y="md" isLoading={cancelContractRequestMutation.variables?.status === "inProgress" && cancelContractRequestMutation.isLoading}>
                Keep Contract
            </PrimaryButton>
            <button disabled={cancelContractRequestMutation.isLoading} onClick={cancelContractHandler} className="font-medium text-red-600 p-2 flex items-center justify-center">
                {cancelContractRequestMutation.isLoading && cancelContractRequestMutation.variables?.status === "canceled"
                    ? <>
                        <span className="invisible flex">
                            Cancel Contract
                        </span>
                        <TbLoader2 className="animate-spin absolute" size={20} />
                    </>
                    : "Cancel Contract"}
            </button>
        </div>
    )
}

export default CancelContractCta