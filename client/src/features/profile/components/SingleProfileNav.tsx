import { FaLinkedinIn, FaTwitter, FaFacebookF, FaEdit } from "react-icons/fa";
import SocialShare from "./SocialShare";
import SaveProfile from "./SaveProfile";
import ReportProfile from "./ReportProfile";
import { useNavigate } from "react-router-dom";

interface Props {
    isCurrentUser: boolean;
}

const SingleProfileNav = (props: React.PropsWithoutRef<Props>) => {

    const socialPlatforms = [
        { icon: FaTwitter, href: "https://twitter.com" },
        { icon: FaLinkedinIn, href: "https://www.linkedin.com" },
        { icon: FaFacebookF, href: "https://facebook.com" }
    ];

    const navigate = useNavigate();

    return (
        <nav className="p-4 inline-flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
                <SocialShare socialPlatforms={socialPlatforms} />
                {props.isCurrentUser ? null : <SaveProfile />}
            </div>
            {props.isCurrentUser ?
                <button onClick={() => navigate("/profile/settings")} className="flex items-center gap-2 font-medium p-1 text-purple-500"><FaEdit className="text-lg mb-[.1rem]" /> Edit</button>
                :
                <ReportProfile />
            }
        </nav>
    )
}

export default SingleProfileNav