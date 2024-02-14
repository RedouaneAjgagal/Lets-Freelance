import { createPortal } from "react-dom";
import SingleServiceContent from "./SingleServiceContent";
import Overlay from "../../../layouts/Overlay";
import { SingleServiceType } from "../services/getSingleService";
import { useAppSelector } from "../../../hooks/redux";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";
import useCreateServiceMutation from "../hooks/useCreateServiceMutation";
import { TierType } from "../services/createService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOverflow from "../../../hooks/useOverflow";

type CreateServicePreviewModalProps = {
    onCloseModal: () => void;
}

const CreateServicePreviewModal = (props: React.PropsWithoutRef<CreateServicePreviewModalProps>) => {
    const userInfo = useAppSelector(state => state.authReducer).userInfo!;
    const createServiceInfo = useAppSelector(state => state.createServiceReducer);

    const createServiceMutation = useCreateServiceMutation();

    const navigate = useNavigate();

    const category = createServiceInfo.category.value.toLowerCase() as "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";

    const initialTierValues = {
        starter: {
            deliveryTime: 0,
            price: 0,
            includedIn: []
        },
        standard: {
            deliveryTime: 0,
            price: 0,
            includedIn: []
        },
        advanced: {
            deliveryTime: 0,
            price: 0,
            includedIn: []
        }
    }

    const previewTiers: {
        starter: SingleServiceType["tier"]["starter"]
        standard: SingleServiceType["tier"]["standard"]
        advanced: SingleServiceType["tier"]["advanced"]
    } = initialTierValues;

    const createServiceTiers: {
        starter: TierType;
        standard: TierType;
        advanced: TierType;
    } = initialTierValues;

    Object.entries(createServiceInfo.tier).map(([key, tier]) => {
        const tierName = key as "starter" | "standard" | "advanced";

        previewTiers[tierName] = {
            deliveryTime: tier.deliveryTime.value,
            price: tier.price.value,
            includedIn: tier.includedIn.value.map(includedIn => {
                return { _id: includedIn.id, description: includedIn.description.value, result: includedIn.result.value }
            })
        }

        createServiceTiers[tierName] = {
            deliveryTime: tier.deliveryTime.value,
            price: tier.price.value,
            includedIn: tier.includedIn.value.map(includedIn => {
                return { description: includedIn.description.value, result: includedIn.result.value }
            })
        }
    })

    const serviceInfo: SingleServiceType = {
        _id: "preview_id",
        category,
        createdAt: new Date().toLocaleDateString(),
        description: createServiceInfo.description.value,
        featuredImage: createServiceInfo.featuredImage.value,
        gallery: createServiceInfo.gallery.value,
        profile: {
            _id: userInfo.profileId,
            name: userInfo.userName,
            avatar: userInfo.avatar,
            roles: { freelancer: { badge: "none" } },
            rating: {
                numOfReviews: 0
            },
            userAs: "freelancer"
        },
        rating: {
            numOfReviews: 0
        },
        tier: previewTiers,
        title: createServiceInfo.title.value,
        updatedAt: new Date().toLocaleDateString(),
        user: userInfo.userId
    };

    const createServiceHandler = () => {
        if (createServiceMutation.isLoading) {
            return;
        }

        createServiceMutation.mutate({
            title: serviceInfo.title,
            description: serviceInfo.description,
            category: serviceInfo.category,
            featuredImage: serviceInfo.featuredImage,
            gallery: serviceInfo.gallery,
            tier: createServiceTiers,
            keywords: createServiceInfo.keywords.value.map(value => value.keyword)
        });
    }

    useEffect(() => {
        if (createServiceMutation.isSuccess) {
            navigate("/profile/freelancer/services");
        }
    }, [createServiceMutation.isSuccess])

    useOverflow(!createServiceMutation.isSuccess);

    return (
        createPortal(
            <div>
                <Overlay onClose={props.onCloseModal} />
                <section className="fixed w-[90%] flex flex-col gap-4 z-50 p-3 py-6 bg-white overflow-y-scroll duration-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[90%] rounded pb-14">
                    <SingleServiceContent serviceInfo={serviceInfo} isPreview />
                </section>
                <div className="fixed z-50 bg-white w-full bottom-0 left-0 flex justify-between items-center p-4 border-t border-slate-300">
                    <button onClick={props.onCloseModal} className="font-medium text-slate-600 flex items-center gap-1 p-1">
                        <BiArrowBack size={16} />
                        Back
                    </button>
                    <PrimaryButton disabled={createServiceMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="button" x="lg" y="md" onClick={createServiceHandler}>Submit</PrimaryButton>
                </div>
            </div>
            , document.getElementById("overlay")!
        )
    )
}

export default CreateServicePreviewModal