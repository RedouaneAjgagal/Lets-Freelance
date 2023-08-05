import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";
import SocialShare from "./SocialShare";
import SaveProfile from "./SaveProfile";
import ReportProfile from "./ReportProfile";

const SingleProfileNav = () => {

    const socialPlatforms = [
        { icon: FaTwitter, href: "https://twitter.com" },
        { icon: FaLinkedinIn, href: "https://www.linkedin.com" },
        { icon: FaFacebookF, href: "https://facebook.com" }
    ];

    return (
        <div className="p-4 inline-flex items-center justify-between">
            <div className="flex items-center  gap-6">
                <SocialShare socialPlatforms={socialPlatforms} />
                <SaveProfile />
            </div>
            <ReportProfile />
        </div>
    )
}

export default SingleProfileNav