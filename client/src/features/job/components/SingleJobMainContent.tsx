import { TbCalendar, TbClock, TbRobot, TbCurrencyDollar, TbLocation } from "react-icons/tb";
import { SingleJobType } from "../service/getSingleJob"
import { IconType } from "react-icons";
import toUpperCase from "../../../utils/toUpperCase";

type SingleJobMainContentProps = {
    jobMainDetails: {
        description: SingleJobType["description"];
        weeklyHours: SingleJobType["weeklyHours"];
        duration: SingleJobType["duration"];
        priceType: SingleJobType["priceType"];
        price: SingleJobType["price"];
        locationType: SingleJobType["locationType"];
        experienceLevel: SingleJobType["experienceLevel"];
        connects: SingleJobType["connects"];
    }
}

const SingleJobMainContent = (props: React.PropsWithoutRef<SingleJobMainContentProps>) => {
    const durationDateType = props.jobMainDetails.duration.dateType.slice(0, -1);
    const durationDateTypePluralize = props.jobMainDetails.duration.dateValue > 1 ? "s" : "";
    const durationContent = `${props.jobMainDetails.duration.dateValue} ${durationDateType}${durationDateTypePluralize}`


    const experienceLevelContent = props.jobMainDetails.experienceLevel === "entryLevel" ? "Entery level" : toUpperCase({ value: props.jobMainDetails.experienceLevel });


    const priceContent = props.jobMainDetails.priceType === "hourly" ?
        `$${props.jobMainDetails.price.min.toFixed(2)} - $${props.jobMainDetails.price.max.toFixed(2)}`
        : `$${props.jobMainDetails.price.max.toFixed(2)}`;

    const locationContent = toUpperCase({ value: props.jobMainDetails.locationType });

    const features: { icon: IconType; content: string; subContent?: string }[] = [
        {
            icon: TbCalendar,
            content: durationContent,
            subContent: "Duration"
        },
        {
            icon: TbClock,
            content: `${props.jobMainDetails.weeklyHours.min}-${props.jobMainDetails.weeklyHours.max} hrs/week`,
            subContent: "Hourly"
        },
        {
            icon: TbRobot,
            content: experienceLevelContent,
            subContent: "Experience Level"
        },
        {
            icon: TbCurrencyDollar,
            content: priceContent,
            subContent: props.jobMainDetails.priceType === "fixed" ? "Fixed-price" : "Hourly"
        },
        {
            icon: TbLocation,
            content: locationContent
        }
    ];

    return (
        <article className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-slate-800">Description</h2>
            <p className="text-slate-800">{props.jobMainDetails.description}</p>
            <section className="py-6">
                <ul className="flex flex-col gap-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex gap-2">
                            <div>
                                <feature.icon size={24} />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-medium">{feature.content}</p>
                                {feature.subContent ?
                                    <span className="text-sm text-slate-700">{feature.subContent}</span>
                                    : null
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    )
}

export default SingleJobMainContent