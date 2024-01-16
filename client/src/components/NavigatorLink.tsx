import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'

type NavigatorLinkProps = {
    to: string;
}

const NavigatorLink = (props: React.PropsWithChildren<NavigatorLinkProps>) => {
    return (
        <Link to={props.to} className="flex justify-center items-center gap-2 border border-slate-500 rounded py-3 font-medium">
            {props.children}
            <BiArrowBack className="rotate-[135deg]" />
        </Link>
    )
}

export default NavigatorLink