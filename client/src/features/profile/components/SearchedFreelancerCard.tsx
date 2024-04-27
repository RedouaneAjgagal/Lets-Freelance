import { Link } from "react-router-dom";
import Badge from "../../../layouts/brand/Badge"
import formatProfileName from "../../../utils/formatProfileName"
import { MdOutlinePerson4 } from "react-icons/md";
import { PrimaryButton, PrimaryLink } from "../../../layouts/brand";
import { BsStar, BsStarFill } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";

const SearchedFreelancerCard = () => {

    const profileName = formatProfileName("Freelaner Ali");

    const skills = ["react", "express", "mern", "node", "react landing page"];

    const navigateToProfile = () => {
        console.log("Navigate");

    }


    const hourlyBudget = `$${(17.5).toFixed(2)}/hr`;

    const totalRevenue = 2793 >= 1000 ?
        `$${(2793 / 1000).toFixed(1)}K`
        : `$${(2793).toFixed(0)}`;

    return (
        <li className="py-8 px-4 flex flex-col gap-5 border-b last:border-0 first:pt-4">
            <div className="flex items-center gap-3">
                <div className="min-h-full max-w-full relative">
                    <img className="rounded-full min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] object-cover" src="https://res.cloudinary.com/dqfrgtxde/image/upload/v1706661368/avatars_lets-freelance/bzicxpypdzlztrsxwxkp.webp" alt="Freelancer avatar" />
                    <div className="absolute -right-0 bottom-0">
                        <Badge badge="rising talent" size="md" minimized />
                    </div>
                </div>
                <div className="text-[.95rem] flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Link to={`/profiles`} className="font-medium hover:underline">{profileName}</Link>
                        <span className="text-sm text-slate-600">Morocco</span>
                    </div>
                    <div>
                        <h3 className="font-medium line-clamp-1">Full Stack Developer | Mern Stack Developer | NextJs Developer</h3>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap text-base font-normal">
                        <BsStarFill className="text-yellow-500" />
                        <span className="font-semibold text-black text-[1.05rem]">4.9</span>
                        <span className="text-slate-500 text-sm">(2 Reviews)</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-x-6 gap-y-3 text-slate-500 font-medium text-[1.05rem]">
                <span className="">{hourlyBudget}</span>
                <span className="text">{totalRevenue}+ earned</span>
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <MdOutlinePerson4 />
                    single freelancer
                </span>
                <span className="border border-blue-600 px-3 rounded-full text-[.95rem] text-blue-600 flex items-center gap-1">
                    <TbWorld />
                    conversational
                </span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {skills.map((skill, index) => (
                    <span key={index} className="capitalize bg-slate-200/80 px-3 py-[0.1rem] rounded-full font-medium text-slate-600">{skill}</span>
                ))}
            </div>
            <div>
                <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: "Hi im a fullstack developer\n\nI can make you any kind of website/saas/platfrom that you need." }}></p>
            </div>
            <div>
                <PrimaryButton fullWith={true} justifyConent="center" x="md" y="md" style="outline" disabled={false} type="button" isLoading={false} onClick={navigateToProfile}>View Profile</PrimaryButton>
            </div>
        </li>
    )
}

export default SearchedFreelancerCard