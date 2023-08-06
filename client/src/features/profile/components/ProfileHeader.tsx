import { TbStar, TbLocation, TbCalendar } from "react-icons/tb"
import { PrimaryButton } from "../../../layouts/brand";

interface Props {
    userInfo: {
        name: string;
        avatar: string;
        jobTitle: string;
        rating: number;
        reviews: number;
        location: string;
        dateOfBirth: string;
    }
}

const ProfileHeader = (props: React.PropsWithoutRef<Props>) => {
    const inviteHandler = () => {
        console.log("invite");
    }

    const messageHandler = () => {
        console.log("message");
    }

    const dateOfBirth = new Date(props.userInfo.dateOfBirth).toDateString();
    return (
        <section className="bg-purple-100/30">
            <div className="px-4 py-8 flex flex-col gap-8">
                <article className="flex items-center gap-6">
                    <img src={props.userInfo.avatar} alt={`${props.userInfo.name}'s avatar`} className="w-28 h-28 object-cover rounded-full" />
                    <div className="flex flex-col gap-4 font-medium">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl">{props.userInfo.name}</h3>
                            <p className="text-slate-700 font-normal">{props.userInfo.jobTitle}</p>
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-3">
                            <div className="flex items-center flex-wrap gap-2">
                                <TbStar className="text-lg text-slate-700" />
                                <span>{props.userInfo.rating.toFixed(1)}</span>
                                <span>{`(${props.userInfo.rating} Reviews)`}</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <TbLocation className="text-lg text-slate-700" />
                                <span>{props.userInfo.location}</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                                <TbCalendar className="text-lg text-slate-700" />
                                <span>{dateOfBirth}</span>
                            </div>
                        </div>
                    </div>
                </article>
                <div className="flex gap-3">
                    <PrimaryButton style="solid" fullWith={false} justifyConent="start" type="button" x="lg" y="md" children="Invite" onClick={inviteHandler} disabled={false} />
                    <PrimaryButton style="solid" fullWith={false} justifyConent="start" type="button" x="lg" y="md" children="Message" onClick={messageHandler} disabled={false} />
                </div>
            </div>
        </section>
    )
}

export default ProfileHeader