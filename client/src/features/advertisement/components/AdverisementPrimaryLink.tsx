import { Link } from 'react-router-dom'

type AdverisementPrimaryLinkProps = {
    to: string;
    fullWidth?: boolean;
}

const AdverisementPrimaryLink = (props: React.PropsWithChildren<AdverisementPrimaryLinkProps>) => {
    return (
        <Link to={props.to} className={`flex justify-center items-center border-2 border-slate-600 font-semibold h-10 rounded bg-amber-500 relative px-2 ${props.fullWidth ? "w-full" : "w-fit"}`}>
            {props.children}
        </Link>
    )
}

export default AdverisementPrimaryLink