import { TbStar, TbLocation, TbCalendar } from "react-icons/tb"
import { PrimaryButton } from "../../../layouts/brand";
import formatDate from "../../../utils/formatDate";
import { useAppSelector } from "../../../hooks/redux";
import { useSetInitialMessageMutation } from "../../message";
import toast from "react-hot-toast";

interface Props {
    profile: "freelancer" | "employer";
    userInfo: {
        _id: string;
        user: string;
        name: string;
        avatar: string;
        jobTitle?: string;
        rating?: number;
        reviews: number;
        location: string;
        dateOfBirth?: string;
    };
    isCurrentUser: boolean;
}

const ProfileHeader = (props: React.PropsWithoutRef<Props>) => {
    const setInitialMessageMutation = useSetInitialMessageMutation();

    const { userInfo } = useAppSelector(state => state.authReducer);

    const messageHandler = () => {
        if (props.profile !== "freelancer" || setInitialMessageMutation.isLoading) return;

        if (!userInfo) {
            toast.error("Please login first", {
                id: "error_setInitialMessage",
                duration: 3000
            });

            return;
        };

        if (userInfo.userAs !== "employer") return;

        setInitialMessageMutation.mutate({
            userId: props.userInfo.user
        });
    }

    const dateOfBirth = formatDate(props.userInfo.dateOfBirth || "");

    return (
        <section className={`bg-purple-100/40 xl:rounded-xl xl:mx-4 xl:p-4 ${props.isCurrentUser ? "mt-0 py-6 xl:mt-8" : ""}`}>
            <div className="px-4 py-8 flex flex-col gap-8 xl:flex-row xl:justify-between xl:justify-self-center xl:items-center">
                <article className="flex items-start gap-6 lg:items-center">
                    <img src={props.userInfo.avatar} alt={`${props.userInfo.name}'s avatar`} className="w-20 h-20 object-cover rounded-full lg:w-24 lg:h-24" />
                    <div className="flex flex-col gap-4 font-medium">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl">{props.userInfo.name}</h3>
                            {props.userInfo.jobTitle
                                ? <p className="text-slate-700 font-normal">
                                    {props.userInfo.jobTitle}
                                </p>
                                : null
                            }
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-3">
                            <div className="flex items-center flex-wrap gap-2">
                                <TbStar className="text-lg text-slate-700" />
                                {
                                    props.userInfo.rating ?
                                        <>
                                            <span>{props.userInfo.rating}</span>
                                            <span>{`(${props.userInfo.reviews} Reviews)`}</span>
                                        </>
                                        :
                                        <p>no ratings yet</p>
                                }
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <TbLocation className="text-lg text-slate-700" />
                                <span>{props.userInfo.location}</span>
                            </div>
                            {props.userInfo.dateOfBirth ?
                                <div className="flex items-center flex-wrap gap-2">
                                    <TbCalendar className="text-lg text-slate-700" />
                                    <span>{dateOfBirth}</span>
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </article>
                {props.profile === "freelancer" ?
                    !userInfo || userInfo.userAs === "employer"
                        ?
                        <div className="flex sm:self-start xl:self-center">
                            <PrimaryButton style="solid" fullWith={true} justifyConent="center" type="button" x="lg" y="md" onClick={messageHandler} disabled={setInitialMessageMutation.isLoading} isLoading={setInitialMessageMutation.isLoading}>
                                Message
                            </PrimaryButton>
                        </div>
                        : null
                    : null
                }
            </div>
        </section>
    )
}

export default ProfileHeader