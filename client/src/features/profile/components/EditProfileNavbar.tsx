import { Link } from 'react-router-dom'

interface Props {
    isAccountSettings: string | null;
}

const EditProfileNavbar = (props: React.PropsWithoutRef<Props>) => {

    return (
        <nav className="flex items-center gap-5 border border-slate-300 rounded p-2">
            <Link to={"/profile/settings"} className={`text-slate-500 ${props.isAccountSettings ? "" : "underline text-slate-800"}`}>Public profile</Link>
            <Link to={"/profile/settings?account-settings=true"} className={`text-slate-500 ${props.isAccountSettings ? "underline text-slate-800" : ""}`}>Account</Link>
        </nav>
    )
}

export default EditProfileNavbar