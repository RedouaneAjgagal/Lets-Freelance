import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";
import SocialShare from "./SocialShare";
import SaveProfile from "./SaveProfile";
import ReportProfile from "./ReportProfile";

interface Props {
    isCurrentUser: boolean;
}

const SingleProfileNav = (props: React.PropsWithoutRef<Props>) => {

    const socialPlatforms = [
        { icon: FaTwitter, href: "https://twitter.com" },
        { icon: FaLinkedinIn, href: "https://www.linkedin.com" },
        { icon: FaFacebookF, href: "https://facebook.com" }
    ];

    return (
        <nav className="p-4 inline-flex items-center justify-between w-full">
            <div className="flex items-center  gap-6">
                <SocialShare socialPlatforms={socialPlatforms} />
                {props.isCurrentUser ? null : <SaveProfile />}
            </div>
            {props.isCurrentUser ? null : <ReportProfile />}
        </nav>
    )
}

export default SingleProfileNav