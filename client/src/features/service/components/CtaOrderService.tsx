import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { PrimaryButton } from '../../../layouts/brand'
import useOrderServiceMutation from '../hooks/useOrderServiceMutation';
import { SingleServiceType } from '../services/getSingleService';
import { OrderServicePayload } from '../services/orderService';
import { useSetInitialMessageMutation } from '../../message';

type CtaOrderServiceProps = {
    serviceId: SingleServiceType["_id"];
    selectedTier: "starter" | "standard" | "advanced";
    userId: SingleServiceType["user"];
    selectedPackagePrice: number;
}

const CtaOrderService = (props: React.PropsWithoutRef<CtaOrderServiceProps>) => {
    const setInitialMessageMutation = useSetInitialMessageMutation();

    const serviceAdOrderTrackers = useAppSelector(state => state.serviceAdOrderTrackerReducer);

    const [URLSearchParams] = useSearchParams();
    const adId = URLSearchParams.get("ad_id");

    const orderServiceMutation = useOrderServiceMutation();

    const orderServiceHandler = () => {
        const orderPayload: OrderServicePayload = {
            serviceId: props.serviceId,
            tier: props.selectedTier
        }

        if (adId) {
            const isValidAdId = serviceAdOrderTrackers.ad_id === adId;
            if (isValidAdId) {
                orderPayload.track = serviceAdOrderTrackers.track_id;
            }
        }

        orderServiceMutation.mutate(orderPayload);
    }

    const messageFreelancer = () => {
        setInitialMessageMutation.mutate({
            userId: props.userId,
            serviceId: props.serviceId
        });
    };

    return (
        <div className="flex gap-3 fixed bottom-0 bg-white w-full left-1/2 -translate-x-1/2 p-4 border-t z-20">
            <div className="w-full order-1">
                <PrimaryButton disabled={orderServiceMutation.isLoading} fullWith justifyConent="center" style="solid" type="button" x="md" y="lg" onClick={orderServiceHandler}>{`Continue ($${props.selectedPackagePrice.toFixed(0)})`}</PrimaryButton>
            </div>
            <div className="flex">
                <PrimaryButton disabled={setInitialMessageMutation.isLoading} isLoading={setInitialMessageMutation.isLoading} fullWith justifyConent="center" style="outline" type="button" x="md" y="sm" onClick={messageFreelancer}>{`Message`}</PrimaryButton>
            </div>
        </div>
    )
}

export default CtaOrderService