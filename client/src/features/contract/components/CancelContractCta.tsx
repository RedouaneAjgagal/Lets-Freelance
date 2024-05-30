import { PrimaryButton } from "../../../layouts/brand"


const CancelContractCta = () => {
    const cancelContractHandler = () => {
        console.log("Cancel");
    }

    const keepContractHandler = () => {
        console.log("Keep");
    }

    return (
        <div className="flex justify-between flex-wrap gap-3">
            <PrimaryButton onClick={keepContractHandler} disabled={false} fullWith={false} justifyConent="center" style="solid" type="button" x="lg" y="md">
                Keep Contract
            </PrimaryButton>
            <button onClick={cancelContractHandler} className="font-medium text-red-600 p-2">Cancel Contract</button>
        </div>
    )
}

export default CancelContractCta