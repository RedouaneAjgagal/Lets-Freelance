import { Link } from "react-router-dom";
import Badge from "../../../layouts/brand/Badge"
import formatProfileName from "../../../utils/formatProfileName"
import { MdOutlinePerson4 } from "react-icons/md";
import { PrimaryLink } from "../../../layouts/brand";
import { BsStarFill } from "react-icons/bs";
import { TbHeart, TbLoader2, TbWorld } from "react-icons/tb";
import { SearchedTalentType } from "../services/getFreelancers";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { FetchNextPageOptions } from "@tanstack/react-query";
import { useFavoritesMutation } from "../../favorites";
import InfoModal from "../../../layouts/brand/InfoModal";

type SearchedFreelancerCardProps = {
    talent: SearchedTalentType;
    fetchNextPage: (options?: FetchNextPageOptions) => void;
    index: number;
    cursor: number | null;
}

const SearchedFreelancerCard = (props: React.PropsWithoutRef<SearchedFreelancerCardProps>) => {
    const favoritesMutation = useFavoritesMutation({
        event: "profile",
        target: props.talent._id
    });

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

    const profileName = formatProfileName(props.talent.name);

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
        if (favoritesMutation.isLoading) return;
        favoritesMutation.mutate({
            event: "profile",
            target: props.talent._id
        });
    }

    const connectionTypes = {
        online: "before:bg-green-400",
        idle: "before:bg-amber-400",
        offline: "before:bg-slate-300",
    } as const;

    const connectionStyle = connectionTypes[props.talent.status];



    return (
        <li ref={talentCardRef} className="py-8 px-4 grid grid-cols-1 gap-5 border-b last:border-0 first:pt-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">

            <div className="flex items-center gap-3 md:col-span-2 md:order-1 lg:col-span-1 lg:order-1 xl:col-span-2 xl:order-1">
                <div className={`min-h-full max-w-full relative before:h-4 before:w-4 before:absolute before:left-0 before:top-0 before:rounded-full before:border-[2px] before:border-white ${connectionStyle}`}>
                    <img className="rounded-full min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] object-cover " src={props.talent.avatar} alt="Freelancer avatar" />
                    {props.talent.roles.freelancer.badge !== "none"
                        ? <div className="absolute group -right-0 top-11">
                            <Badge badge={props.talent.roles.freelancer.badge} size="md" minimized />
                            <div className="capitalize">
                                <InfoModal content={props.talent.roles.freelancer.badge} position="center" width="md" mobileLayoutAuto />
                            </div>
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
                        <h3 className="font-medium line-clamp-1 text-slate-800 lg:text-lg">
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
            <div className="flex items-center flex-wrap gap-x-6 gap-y-3 text-slate-500 font-medium text-[1.05rem] md:col-span-3 md:order-3 lg:col-span-1 lg:order-2 xl:col-span-3 xl:order-3">
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
                <div className="flex gap-2 flex-wrap md:col-span-3 md:order-4 lg:col-span-1 lg:order-3 xl:col-span-3 xl:order-4">
                    {skills}
                    {hasMoreSkills ?
                        <span className="capitalize bg-slate-200/80 px-3 py-[0.1rem] rounded-full font-medium text-slate-600">{hasMoreSkills}</span>
                        : null
                    }
                </div>
                : null
            }
            <div className="md:col-span-3 md:order-5 lg:col-span-1 lg:order-4 xl:col-span-3 xl:order-5">
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
            <div className="flex items-center gap-2 col-span-1 xl:col-span-1 md:col-span-1 md:order-2 lg:col-span-1 lg:order-5 xl:order-2">
                <PrimaryLink to={`/profiles/${props.talent._id}`} outline fullWith={true} justifyConent="center" x="md" y="md">
                    View Profile
                    <BiArrowBack className="rotate-[135deg]" />
                </PrimaryLink>
                <button onClick={saveProfileHandler} disabled={favoritesMutation.isLoading} className={`border px-4 text-[.95rem] rounded-full flex gap-1 py-2 font-medium items-center justify-center ${props.talent.isFavourite ? "text-white border-purple-600 bg-purple-600" : "text-slate-700 border-slate-300"}`}>
                    {favoritesMutation.isLoading ?
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