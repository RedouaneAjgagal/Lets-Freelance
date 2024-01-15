import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'

type NavigatorLinkProps = {
    to: string;
    children: string;
}

const NavigatorLink = (props: React.PropsWithoutRef<NavigatorLinkProps>) => {
    return (
        <Link to={props.to} className="flex justify-center items-center gap-2 border border-slate-500 rounded py-3 font-medium">
            {props.children}
            <BiArrowBack className="rotate-[135deg]" />
        </Link>
    )
}

export default NavigatorLink