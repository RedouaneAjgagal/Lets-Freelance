import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";
import SocialShare from "./SocialShare";
import SaveActivity from "./SaveActivity";
import ReportActivity from "./ReportActivity";

type SingleActivityNavbarProps = {
    activity: "profile" | "job" | "service";
    hideShare?: boolean;
    hideSave?: boolean;
    hideReport?: boolean;
    target: string;
}

const SingleActivityNavbar = (props: React.PropsWithoutRef<SingleActivityNavbarProps>) => {
    const socialPlatforms = [
        { icon: FaTwitter, href: "https://twitter.com" },
        { icon: FaLinkedinIn, href: "https://linkedin.com" },
        { icon: FaFacebookF, href: "https://facebook.com" }
    ];

    return (
        <nav className="inline-flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
                {props.hideShare ?
                    null
                    : <SocialShare socialPlatforms={socialPlatforms} />
                }
                {props.hideSave ?
                    null
                    : <SaveActivity activity={props.activity} />
                }
            </div>
            {props.hideReport ?
                null
                : <ReportActivity activity={props.activity} target={props.target} />
            }
        </nav>
    )
}

export default SingleActivityNavbar