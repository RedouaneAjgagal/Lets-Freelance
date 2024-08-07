import { createPortal } from "react-dom";
import SingleServiceContent from "./SingleServiceContent";
import Overlay from "../../../layouts/Overlay";
import { SingleServiceType } from "../services/getSingleService";
import { useAppSelector } from "../../../hooks/redux";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";
import useCreateServiceMutation from "../hooks/useCreateServiceMutation";
import { TierType } from "../services/createService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useOverflow from "../../../hooks/useOverflow";
import useUpdateServiceMutation from "../hooks/useUpdateServiceMutation";

type CreateServicePreviewModalProps = {
    onCloseModal: () => void;
    formType: "create" | "update";
}

const CreateServicePreviewModal = (props: React.PropsWithoutRef<CreateServicePreviewModalProps>) => {
    const userInfo = useAppSelector(state => state.authReducer).userInfo!;
    const createServiceInfo = useAppSelector(state => state.serviceFormReducer);

    const createServiceMutation = useCreateServiceMutation();
    const updateServiceMutation = useUpdateServiceMutation();

    const navigate = useNavigate();
    const params = useParams();

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
        user: userInfo.userId,
        isFavorited: false,
    };

    const createServiceHandler = () => {
        if (createServiceMutation.isLoading) {
            return;
        }

        if (props.formType === "create") {
            createServiceMutation.mutate({
                title: serviceInfo.title,
                description: serviceInfo.description,
                category: serviceInfo.category,
                featuredImage: serviceInfo.featuredImage,
                gallery: serviceInfo.gallery,
                tier: createServiceTiers,
                keywords: createServiceInfo.keywords.value.map(value => value.keyword)
            });
        } else {
            const serviceId = params.serviceId!;
            updateServiceMutation.mutate({
                serviceId,
                service: {
                    title: serviceInfo.title,
                    description: serviceInfo.description,
                    category: serviceInfo.category,
                    featuredImage: serviceInfo.featuredImage,
                    gallery: serviceInfo.gallery,
                    tier: createServiceTiers
                }
            })
        }
    }

    useEffect(() => {
        if (createServiceMutation.isSuccess || updateServiceMutation.isSuccess) {
            navigate("/profile/freelancer/services");
        }
    }, [createServiceMutation.isSuccess, updateServiceMutation.isSuccess]);

    useOverflow(!updateServiceMutation.isSuccess);


    const [selectedTier, setSelectedTier] = useState<"starter" | "standard" | "advanced">("starter");
    const changeTierHandler = (tier: "starter" | "standard" | "advanced") => {
        setSelectedTier(tier)
    }

    return (
        createPortal(
            <div>
                <Overlay onClose={props.onCloseModal} />
                <section className="fixed w-[90%] flex flex-col gap-4 z-50 p-3 py-6 bg-white overflow-y-scroll duration-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[90%] rounded pb-14 sm:pt-4 sm:px-4 md:p-6 md:h-[80%] md:-translate-y-2/3 md:mt-16 md:max-w-[680px]">
                    <SingleServiceContent onChangeTier={changeTierHandler} selectedTier={selectedTier} serviceInfo={serviceInfo} isPreview />
                </section>
                <div className="fixed z-50 bg-white w-full bottom-0 left-0 flex justify-between items-center p-4 border-t border-slate-300 md:py-6 md:px-24">
                    <button onClick={props.onCloseModal} className="font-medium text-slate-600 flex items-center gap-1 p-1">
                        <BiArrowBack size={16} />
                        Back
                    </button>
                    <div className="sm:min-w-[16rem]">
                        <PrimaryButton isLoading={createServiceMutation.isLoading || updateServiceMutation.isLoading} disabled={createServiceMutation.isLoading || updateServiceMutation.isLoading} fullWith={true} justifyConent="center" style="solid" type="button" x="lg" y="md" onClick={createServiceHandler}>
                            {props.formType === "create" ?
                                "Submit"
                                : "Update"
                            }
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            , document.getElementById("overlay")!
        )
    )
}

export default CreateServicePreviewModal