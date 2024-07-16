import { Link, NavLink } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import formatProfileName from "../../../utils/formatProfileName";
import toUpperCase from "../../../utils/toUpperCase";
import { SingleJobType } from "../service/getSingleJob"
import { useAppSelector } from "../../../hooks/redux";
import ApplyJobContainer from "./ApplyJobContainer";

type SingleJobAboutClientProps = {
    clientInfo: SingleJobType["profile"];
    connects: number;
    jobId: string;
    jobStatus: "open" | "closed";
    hasSubmitted: boolean;
    isFavorited: SingleJobType["isFavorited"];
    isDesktopLayout?: boolean;
}

const SingleJobAboutClient = (props: React.PropsWithoutRef<SingleJobAboutClientProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const createdAt = `Member since ${formatDate(props.clientInfo.createdAt)}`;

    const postedJobsPluralize = props.clientInfo.totalJobPosted === 1 ? "" : "s";

    const totalSpent = props.clientInfo.totalSpentOnJobs >= 1000 ?
        `$${(props.clientInfo.totalSpentOnJobs / 1000).toFixed(1)}K`
        : `$${props.clientInfo.totalSpentOnJobs.toFixed(0)} `;


    const avgHourlyRate = `$${props.clientInfo.avgHourlyRatePaid.toFixed(2)}`;

    const aboutClient = {
        country: props.clientInfo.country,
        postedJobs: `${props.clientInfo.totalJobPosted} job${postedJobsPluralize} posted`,
        totalSpent: `${totalSpent} total spent on jobs`,
        avgHourlyRate: `${avgHourlyRate} /hr avg hourly rate paid`,
        category: toUpperCase({ value: props.clientInfo.category, everyWord: true })
    };

    if (!aboutClient.country) delete aboutClient.country;

    const employerName = formatProfileName(props.clientInfo.name);

    return (
        <aside className={props.isDesktopLayout ? "hidden lg:w-full lg:flex lg:flex-col lg:gap-12 lg:p-4 lg:bg-slate-100/70 lg:rounded-lg xl:p-6" : "flex flex-col lg:hidden"}>
            {userInfo && userInfo.userAs === "employer" || props.jobStatus === "closed"
                ? null
                : <div className="flex lg:order-2">
                    {userInfo
                        ? userInfo.userAs === "freelancer" && props.jobStatus === "open"
                            ? <header className={props.isDesktopLayout ? "flex items-center w-full gap-2 lg:flex-col xl:flex-row" : "fixed bg-slate-50 bottom-0 left-0 w-full px-4 h-20 items-center z-10 flex gap-4 border-t lg:hidden"}>
                                <ApplyJobContainer connects={props.connects} jobId={props.jobId} hasSubmitted={props.hasSubmitted} isFavorited={props.isFavorited} />
                            </header>
                            : null
                        : <header className={props.isDesktopLayout ? "w-full flex flex-col gap-2" : "fixed bg-slate-50 bottom-0 left-0 w-full px-4 h-20 items-center z-10 flex gap-4 border-t lg:hidden"}>
                            <NavLink className="w-full flex justify-center border-2 border-purple-600 rounded font-semibold text-purple-600 py-2 hover:bg-purple-700 hover:border-purple-700 hover:text-white transition-all" to={"/auth/login"}>
                                Log in
                            </NavLink>
                            <NavLink className="w-full flex justify-center border-2 border-purple-700 rounded font-semibold text-white bg-purple-700 py-2 hover:bg-purple-600 hover:border-purple-600 transition-all" to={"/auth/register"}>
                                Sign up
                            </NavLink>
                        </header>
                    }
                </div>
            }
            <div className={props.isDesktopLayout ? "hidden lg:flex lg:flex-col lg:gap-6" : "flex flex-col gap-6 lg:hidden"}>
                <section className="flex flex-col gap-1">
                    <h3 className="text-xl font-medium text-slate-800">About the client</h3>
                    <small>{createdAt}</small>
                    <ul className="flex flex-col gap-3 py-2">
                        {Object.entries(aboutClient).map(([key, value]) => (
                            <li key={key}>
                                <strong className="font-medium">{value}</strong>
                            </li>
                        ))}
                    </ul>
                </section>
                <footer className="flex items-center gap-2 -mt-2 lg:flex-col lg:items-start lg:gap-0">
                    <span>View client profile:</span>
                    <Link to={`/profiles/${props.clientInfo._id}`} className="font-semibold flex items-center gap-1 relative text-purple-700 underline">
                        {employerName}
                    </Link>
                </footer>
            </div>
        </aside>
    )
}

export default SingleJobAboutClient