import { IconType } from 'react-icons';
import { TbShare } from 'react-icons/tb';
import { Link } from 'react-router-dom';

interface Props {
    socialPlatforms: { icon: IconType, href: string }[]
}

const SocialShare = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="relative group">
            <button className="flex items-center gap-2 font-medium group-hover:text-purple-600 duration-200">
                <span className="p-2 rounded-full border shadow-sm group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-600 duration-200"><TbShare /></span>
                Share
            </button>
            <div className="group-hover:visible group-hover:opacity-100 invisible opacity-0 duration-200  absolute -top-[3.8rem] left-3 pb-4">
                <div className="flex items-end gap-2 py-1 px-2 border border-purple-600 rounded rounded-bl-none after:border-t-purple-600 after:border-l-purple-600 after:border-b-transparent after:border-r-transparent after:border-l-[.4rem] after:border-r-[.4rem] after:border-b-[.4rem] after:border-t-[.4rem] after:absolute after:left-0 after:bottom-1 bg-white">
                    {props.socialPlatforms.map((platform, index) => <Link key={index} to={platform.href} target="_blank" rel="noopener" className="p-2 text-lg rounded-full text-purple-600 hover:bg-purple-100 duration-200">
                        <platform.icon /></Link>)}
                </div>
            </div>
        </div>
    )
}

export default SocialShare