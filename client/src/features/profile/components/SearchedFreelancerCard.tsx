import { Link, useNavigate } from "react-router-dom";
import Badge from "../../../layouts/brand/Badge"
import formatProfileName from "../../../utils/formatProfileName"
import { MdOutlinePerson4 } from "react-icons/md";
import { PrimaryButton } from "../../../layouts/brand";
import { BsStarFill } from "react-icons/bs";
import { TbHeart, TbLoader2, TbWorld } from "react-icons/tb";
import { SearchedTalentType } from "../services/getFreelancers";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { FetchNextPageOptions } from "@tanstack/react-query";

type SearchedFreelancerCardProps = {
    talent: SearchedTalentType;
    fetchNextPage: (options?: FetchNextPageOptions) => void;
    index: number;
    cursor: number | null;
}

const SearchedFreelancerCard = (props: React.PropsWithoutRef<SearchedFreelancerCardProps>) => {
    const talentCardRef = useRef<HTMLLIElement>(null);

    const [isRefetch, setIsRefetch] = useState(false);

    const SIZE_OF_PROFILES_PER_FETCH = 12;

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (props.cursor) {
                const INDEX_OF_ALL_SEARCHED_PROFILES = (
                    (props.cursor * SIZE_OF_PROFILES_PER_FETCH)
                    - SIZE_OF_PROFILES_PER_FETCH
                ) + props.index;

                const isFetchIndex = (INDEX_OF_ALL_SEARCHED_PROFILES + 1)
                    % SIZE_OF_PROFILES_PER_FETCH === 0;
                if (entry.isIntersecting && isFetchIndex) {
                    setIsRefetch(true);
                }
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.6
        });

        if (talentCardRef.current) {
            observer.observe(talentCardRef.current);
        }

        return () => {
            if (talentCardRef.current) {
                observer.unobserve(talentCardRef.current);
            }
        }
    }, []);

    useEffect(() => {
        if (isRefetch) {
            props.fetchNextPage();
        }
    }, [isRefetch]);


    const navigate = useNavigate();
    const profileName = formatProfileName(props.talent.name);

    const navigateToProfile = () => {
        navigate(`/profiles/${props.talent._id}`)
    }

    const hourlyBudget = `$${(props.talent.roles.freelancer.hourlyRate).toFixed(2)}/hr`;

    const totalRevenue = props.talent.totalRevenue >= 1000 ?
        `$${(props.talent.totalRevenue / 1000).toFixed(1)}K`
        : `$${(props.talent.totalRevenue).toFixed(0)}`;


    const MAX_SKILLS = 5;
    const skills = props.talent.roles.freelancer.skills.slice(0, MAX_SKILLS).map((skill, index) => {
        return (
            <span key={index} className="capitalize bg-slate-200/80 px-3 py-[0.1rem] rounded-full font-medium text-slate-600">{skill}</span>
        )
    });
    const hasMoreSkills = props.talent.roles.freelancer.skills.length > 5 ? `+${props.talent.roles.freelancer.skills.length - 5}`
        : "";

    const description = props.talent.description || "Talent with no description";

    const saveProfileHandler = () => {
        console.log(`save profile ${props.talent._id}`);
    }

    return (
        <li ref={talentCardRef} className="py-8 px-4 flex flex-col gap-5 border-b last:border-0 first:pt-4">
            <div className="flex items-center gap-3">
                <div className="min-h-full max-w-full relative">
                    <img className="rounded-full min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] object-cover" src={props.talent.avatar} alt="Freelancer avatar" />
                    {props.talent.roles.freelancer.badge !== "none" ?
                        <div className="absolute -right-0 bottom-0">
                            <Badge badge={props.talent.roles.freelancer.badge} size="md" minimized />
                        </div>
                        : null
                    }
                </div>
                <div className="text-[.95rem] flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Link to={`/profiles/${props.talent._id}`} className="font-medium hover:underline">{profileName}</Link>
                        {props.talent.country ?
                            <span className="text-sm text-slate-600">{props.talent.country}</span>
                            : null
                        }
                    </div>
                    <div>
                        <h3 className="font-medium line-clamp-1">
                            {props.talent.roles.freelancer.jobTitle ?
                                props.talent.roles.freelancer.jobTitle
                                : "Talent with no job title"
                            }
                        </h3>
                    </div>
                    {props.talent.rating.avgRate ?
                        <div className="flex items-center gap-1 flex-wrap text-base font-normal">
                            <BsStarFill className="text-yellow-500" />
                            <span className="font-semibold text-black text-[1.05rem]">{props.talent.rating.avgRate.toFixed(1)}</span>
                            <span className="text-slate-500 text-sm">({props.talent.rating.numOfReviews} Reviews)</span>
                        </div>
                        : null
                    }
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-x-6 gap-y-3 text-slate-500 font-medium text-[1.05rem]">
                <span className="">{hourlyBudget}</span>
                {props.talent.totalRevenue !== 0 ?
                    <span className="text">{totalRevenue}+ earned</span>
                    : null
                }
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <MdOutlinePerson4 />
                    {props.talent.roles.freelancer.types}
                </span>
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <TbWorld />
                    {props.talent.roles.freelancer.englishLevel}
                </span>
            </div>
            {props.talent.roles.freelancer.skills.length ?
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
                <button onClick={saveProfileHandler} className={`border px-4 text-[.95rem] rounded-full flex gap-1 font-medium items-center justify-center ${props.talent.isFavourite ? "text-white border-purple-600 bg-purple-600" : "text-slate-700 border-slate-300"}`}>
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