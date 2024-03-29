import { PrimaryButton } from '../../../layouts/brand'
import useOrderServiceMutation from '../hooks/useOrderServiceMutation';
import { SingleServiceType } from '../services/getSingleService';

type CtaOrderServiceProps = {
    serviceId: SingleServiceType["_id"];
    selectedTier: "starter" | "standard" | "advanced";
    profileId: SingleServiceType["profile"]["_id"];
    selectedPackagePrice: number;
}

const CtaOrderService = (props: React.PropsWithoutRef<CtaOrderServiceProps>) => {
    const orderServiceMutation = useOrderServiceMutation();

    const orderServiceHandler = () => {
        orderServiceMutation.mutate({
            serviceId: props.serviceId,
            tier: props.selectedTier
        });
    }

    const messageFreelancer = () => {
        console.log({ profileId: props.profileId });
    }

    return (
        <div className="flex gap-3 fixed bottom-0 bg-white w-full left-1/2 -translate-x-1/2 p-4 border-t z-20">
            <div className="w-full order-1">
                <PrimaryButton disabled={orderServiceMutation.isLoading} fullWith justifyConent="center" style="solid" type="button" x="md" y="lg" onClick={orderServiceHandler}>{`Continue ($${props.selectedPackagePrice.toFixed(0)})`}</PrimaryButton>
            </div>
            <div className="flex">
                <PrimaryButton disabled={false} fullWith justifyConent="center" style="outline" type="button" x="md" y="sm" onClick={messageFreelancer}>{`Message`}</PrimaryButton>
            </div>
        </div>
    )
}

export default CtaOrderService