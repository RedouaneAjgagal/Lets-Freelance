import { Link, useNavigate } from "react-router-dom";
import Badge from "../../../layouts/brand/Badge"
import formatProfileName from "../../../utils/formatProfileName"
import { MdOutlinePerson4 } from "react-icons/md";
import { PrimaryButton } from "../../../layouts/brand";
import { BsStarFill } from "react-icons/bs";
import { TbHeart, TbLoader2, TbWorld } from "react-icons/tb";
import { SearchedTalentType } from "../services/getFreelancers";
import { BiArrowBack } from "react-icons/bi";

type SearchedFreelancerCardProps = {
    telent: SearchedTalentType;
}

const SearchedFreelancerCard = (props: React.PropsWithoutRef<SearchedFreelancerCardProps>) => {
    const navigate = useNavigate();
    const profileName = formatProfileName(props.telent.name);

    const navigateToProfile = () => {
        navigate(`/profiles/${props.telent._id}`)
    }

    const hourlyBudget = `$${(props.telent.roles.freelancer.hourlyRate).toFixed(2)}/hr`;

    const totalRevenue = props.telent.totalRevenue >= 1000 ?
        `$${(props.telent.totalRevenue / 1000).toFixed(1)}K`
        : `$${(props.telent.totalRevenue).toFixed(0)}`;


    const MAX_SKILLS = 5;
    const skills = props.telent.roles.freelancer.skills.slice(0, MAX_SKILLS).map((skill, index) => {
        return (
            <span key={index} className="capitalize bg-slate-200/80 px-3 py-[0.1rem] rounded-full font-medium text-slate-600">{skill}</span>
        )
    });
    const hasMoreSkills = props.telent.roles.freelancer.skills.length > 5 ? `+${props.telent.roles.freelancer.skills.length - 5}`
        : "";

    const description = props.telent.description || "Talent with no description";

    const saveProfileHandler = () => {
        console.log(`save profile ${props.telent._id}`);
    }

    return (
        <li className="py-8 px-4 flex flex-col gap-5 border-b last:border-0 first:pt-4">
            <div className="flex items-center gap-3">
                <div className="min-h-full max-w-full relative">
                    <img className="rounded-full min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] object-cover" src={props.telent.avatar} alt="Freelancer avatar" />
                    {props.telent.roles.freelancer.badge !== "none" ?
                        <div className="absolute -right-0 bottom-0">
                            <Badge badge={props.telent.roles.freelancer.badge} size="md" minimized />
                        </div>
                        : null
                    }
                </div>
                <div className="text-[.95rem] flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Link to={`/profiles/${props.telent._id}`} className="font-medium hover:underline">{profileName}</Link>
                        {props.telent.country ?
                            <span className="text-sm text-slate-600">{props.telent.country}</span>
                            : null
                        }
                    </div>
                    <div>
                        <h3 className="font-medium line-clamp-1">
                            {props.telent.roles.freelancer.jobTitle ?
                                props.telent.roles.freelancer.jobTitle
                                : "Telent with no job title"
                            }
                        </h3>
                    </div>
                    {props.telent.rating.avgRate ?
                        <div className="flex items-center gap-1 flex-wrap text-base font-normal">
                            <BsStarFill className="text-yellow-500" />
                            <span className="font-semibold text-black text-[1.05rem]">{props.telent.rating.avgRate.toFixed(1)}</span>
                            <span className="text-slate-500 text-sm">({props.telent.rating.numOfReviews} Reviews)</span>
                        </div>
                        : null
                    }
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-x-6 gap-y-3 text-slate-500 font-medium text-[1.05rem]">
                <span className="">{hourlyBudget}</span>
                {props.telent.totalRevenue !== 0 ?
                    <span className="text">{totalRevenue}+ earned</span>
                    : null
                }
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <MdOutlinePerson4 />
                    {props.telent.roles.freelancer.types}
                </span>
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <TbWorld />
                    {props.telent.roles.freelancer.englishLevel}
                </span>
            </div>
            {props.telent.roles.freelancer.skills.length ?
                <div className="flex gap-2 flex-wrap">
                    {skills}
                    {hasMoreSkills ?
                        <span className="capitalize bg-slate-200/80 px-3 py-[0.1rem] rounded-full font-medium text-slate-600">{hasMoreSkills}</span>
                        : null
                    }
                </div>
                : null
            }
            <div>
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
            <div className="flex gap-2">
                <PrimaryButton fullWith={true} justifyConent="center" x="md" y="md" style="outline" disabled={false} type="button" isLoading={false} onClick={navigateToProfile}>
                    View Profile
                    <BiArrowBack className="rotate-[135deg]" />
                </PrimaryButton>
                <button onClick={saveProfileHandler} className={`border px-4 text-[.95rem] rounded-full flex gap-1 font-medium items-center justify-center ${props.telent.isFavourite ? "text-white border-purple-600 bg-purple-600" : "text-slate-700 border-slate-300"}`}>
                    {false ?
                        <TbLoader2 className="animate-spin" />
                        : <TbHeart />
                    }
                    Save
                </button>
            </div>
        </li>
    )
}

export default SearchedFreelancerCard